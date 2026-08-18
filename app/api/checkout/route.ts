import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe'; // Ini akan berfungsi selepas anda install stripe tadi

export async function POST(req: Request) {
  try {
    const { total, albumId } = await req.json();

    if (!total || !albumId) {
      return NextResponse.json({ error: 'Missing total or albumId' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'myr',
          product_data: { name: `Photos from ${albumId}` },
          unit_amount: Math.round(Number(total) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Checkout Error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}