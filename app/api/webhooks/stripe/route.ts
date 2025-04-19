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
        
    } catch (error) {
        
    }
}
