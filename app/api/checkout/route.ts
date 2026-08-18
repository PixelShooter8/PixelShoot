import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { total, albumId } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY tiada dalam Environment Variables Vercel.' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'myr',
          product_data: { name: `Photos from ${albumId || 'Album'}` },
          unit_amount: Math.round(Number(total || 0) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error Details:', err);
    return NextResponse.json({ error: err.message || 'Unknown Server Error' }, { status: 500 });
  }
}