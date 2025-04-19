import {stripe} from "@/lib/stripe";
import {NextResponse, NextRequest} from "next/server";
import {headers} from "next/headers";
import User from "@/models/User";
import Stripe from "stripe";    

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
        )
    } catch (error) {
        
    }
    data = event.data;
    eventType = event.type;

    if (eventType === "checkout.session.completed") {
        const session = await stripe.checkout.sessions.retrieve(data?.object?.id, {
            expand: ["line_items"],
        });

        const customerId = session?.customer
        const customer = await stripe.customers.retrieve(customerId as string);
        const priceId = session?.line_items?.data[0]?.price?.id;
    }
}
