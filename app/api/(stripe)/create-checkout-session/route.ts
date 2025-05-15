import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// POST /api/create-checkout-session
export async function POST(req: NextRequest) {
  try {
    const { minutes, email }: { minutes: number; email: string } = await req.json();

    // Define price in USD cents
    const priceMap: Record<number, number> = {
      10: 1,
      60: 5,
      150: 9,
      360: 19,
    };

    // Validate selected minutes
    if (!priceMap[minutes]) {
      return NextResponse.json({ error: "Invalid minutes selected" }, { status: 400 });
    }

    const amount = priceMap[minutes] * 100; // Convert to cents for Stripe

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Transcription Minutes (${minutes} mins)`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        email,
        minutes: minutes.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/payment/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/payment/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe session creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
