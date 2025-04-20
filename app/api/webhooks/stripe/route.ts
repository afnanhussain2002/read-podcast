import { stripe } from "@/lib/stripe";
import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import User from "@/models/User";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/db";

export async function POST(req: NextRequest) {
  console.log("📬 Webhook received");
  await connectToDatabase();

  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
    console.log("✅ Event verified:", event.type);
  } catch (error) {
    console.error("❌ Error verifying Stripe webhook:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    try {
      const session = event.data.object as Stripe.Checkout.Session;
      const { email, minutes } = session.metadata;

      console.log(`🎉 Payment received for user: ${email} and update ${minutes}`);

      if (!email || !minutes) {
        return NextResponse.json(
          { error: "Missing metadata" },
          { status: 400 }
        );
      }

      const user = await User.findOneAndUpdate(
        { email },
        {
          $inc: {
            transcriptMinutes: parseInt(minutes),
          },
        }, // increment minutes
        { new: true }
      );

      console.log("udated user", user);

      if (!user) {
        console.error("User not found");
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      console.log(`🎉 Added ${minutes} minutes to user: ${email}`);
    } catch (err) {
      console.error("❌ Error updating user:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  revalidatePath("/dashboard", "layout");

  return new NextResponse("Webhook processed", { status: 200 });
}
