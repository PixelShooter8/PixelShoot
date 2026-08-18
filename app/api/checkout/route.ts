import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase dengan Service Role Key untuk akses penuh di pelayan
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { total, albumId, photos } = body;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_SECRET_KEY tiada dalam Environment Variables Vercel.' }, { status: 500 });
    }

    // 1. Cipta sesi pembayaran di Stripe
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
      // Kita hantar {CHECKOUT_SESSION_ID} supaya halaman success boleh semak pangkalan data
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    });

    // 2. Simpan maklumat sesi dan senarai foto ke dalam Supabase
    const { error: dbError } = await supabase.from('sales').insert({
      session_id: session.id,
      album_id: albumId || null,
      photos: photos || [],
      total: total || 0,
      status: 'pending',
    });

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Stripe Error Details:', err);
    return NextResponse.json({ error: err.message || 'Unknown Server Error' }, { status: 500 });
  }
}