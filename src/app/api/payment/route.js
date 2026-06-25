import { NextResponse } from "next/server";
import Stripe from "stripe";


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    
    const body = await req.json();
    const { hiringId, lawyerId, clientEmail, amount, lawyerName } = body;

  
    if (!hiringId || !amount || !clientEmail) {
      return NextResponse.json(
        { error: "Missing required payment fields (hiringId, amount, clientEmail)" },
        { status: 400 }
      );
    }

   
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Hiring Consultation - ${lawyerName || "Lawyer"}`,
              description: `Payment for Hiring ID: ${hiringId}`,
            },
            unit_amount: Math.round(amount * 100), // $300 = 30000 cents
          },
          quantity: 1,
        },
      ],
      
     
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      
     
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/user/hiring-history?canceled=true`,
      
      
      metadata: {
        hiringId: hiringId,
        lawyerId: lawyerId,
        clientEmail: clientEmail,
      },
    });

   
    return NextResponse.json({ id: session.id, url: session.url });

  } catch (error) {
    console.error("Stripe Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}