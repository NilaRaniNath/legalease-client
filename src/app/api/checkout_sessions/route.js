import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';


export async function POST(req) { 
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');

    // 💡 URL কুয়েরি প্যারামিটার থেকে এখন email উদ্ধার করা হচ্ছে
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email'); 

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: 'price_1TlaqNP2B1tIRagPiUa7dELm', 
          quantity: 1,
        },
      ],
      mode: 'payment',
      
      customer_email: email, 

      metadata: {
        email: email // ব্যাকএন্ডের জন্য মেটাডাটায় রেখে দিলাম
      },
      
      // 💡 সাকসেস ইউআরএল-এ এবার userId-এর জায়গায় email জুড়ে দেওয়া হলো
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&email=${email}`,
      cancel_url: `${origin}/dashboard/lawyer/manage-legal-profile`,
    });

    return NextResponse.redirect(session.url, 303);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}