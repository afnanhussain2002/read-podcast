import { stripe } from "@/lib/stripe";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import User from "@/models/User";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");
  let event: Stripe.Event;
  let data: any;
  let eventType: string;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {}
  data = event.data;
  eventType = event.type;

  if (eventType === "checkout.session.completed") {
    const session = await stripe.checkout.sessions.retrieve(data?.object?.id, {
      expand: ["line_items"],
    });

    const customerId = session?.customer;
    const customer = await stripe.customers.retrieve(customerId as string);
    const priceId = session?.line_items?.data[0]?.price?.id;
    const metadata = event?.data?.object?.metadata;

    if (priceId !== process.env.NEXT_PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID) {
      return NextResponse.json({ error: "Invalid price ID" }, { status: 400 });
    }
    if (metadata) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: metadata.userId },
        { isSubscribed: true, clientId: metadata.clientId },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      } else {
        console.log("user updated");
      }
    }
  }

  revalidatePath("/dashboard", "layout");
  return new NextResponse("webhook received", { status: 200 });
}
