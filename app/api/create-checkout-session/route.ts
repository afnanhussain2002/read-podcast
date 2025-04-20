import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";



export async function POST(req: Request) {
  const { minutes, email } = await req.json();

  // Calculate price based on selected minutes
  const priceMap: Record<number, number> = {
    10: 1,
    60: 5,
    150: 9,
    360: 19,
  };

  const amount = priceMap[minutes] * 100;

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
}
