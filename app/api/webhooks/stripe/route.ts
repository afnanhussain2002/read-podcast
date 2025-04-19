import { stripe } from "@/lib/stripe";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import User from "@/models/User";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  console.log('webhook started');
  await connectToDatabase();
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  let event: Stripe.Event | undefined;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log("event",event);
  } catch (error) {
    console.error("Error verifying Stripe webhook signature:", error);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (event) {
    const data = event.data;
    const eventType = event.type;

    console.log(`Received event type: ${eventType}`);

    if (eventType === "checkout.session.completed") {
      try {
        const session = await stripe.checkout.sessions.retrieve(data?.object?.id, {
          expand: ["line_items"],
        });

        const customerId = session?.customer;
        const customer = await stripe.customers.retrieve(customerId as string);
        const priceId = session?.line_items?.data[0]?.price?.id;
        const sessionObject = event.data.object as Stripe.Checkout.Session;
        const metadata = sessionObject.metadata;

        if (priceId !== process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID) {
          console.error("Invalid price ID");
          return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
        }

        if (metadata) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: metadata.userId },
            { isSubscribed: true, clientId: metadata.clientId },
            { new: true }
          );

          if (!updatedUser) {
            console.error("User not found");
            return NextResponse.json({ error: "User not found" }, { status: 404 });
          } else {
            console.log("User updated successfully");
          }
        }
      } catch (error) {
        console.error("Error processing checkout.session.completed event:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }

    revalidatePath("/dashboard", "layout");
  }

  return new NextResponse("Webhook received", { status: 200 });
}
