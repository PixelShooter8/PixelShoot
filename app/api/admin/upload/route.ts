import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2';
import { supabase } from '@/lib/supabase';
import createReport from 'tesseract.js';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const eventSlug = (formData.get('eventId') as string) || 'maraton-kuching-2026';
    const price = formData.get('price') || '15.00';

    if (!file) {
      return NextResponse.json({ error: 'Sila pilih fail gambar.' }, { status: 400 });
    }

    // 1. Dapatkan UUID Event
    let { data: eventData } = await supabase
      .from('events')
      .select('id')
      .eq('slug', eventSlug)
      .single();

    let finalEventId = eventData?.id;

    if (!finalEventId) {
      const { data: newEvent } = await supabase
        .from('events')
        .insert({ slug: eventSlug, title: `Acara ${eventSlug}` })
        .select('id')
        .single();
      finalEventId = newEvent?.id;
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 2. OCR BIB SEGERA (Eksperimen regex pantas dari nama fail jika bersesuaian, atau imbasan terus)
    let detectedBibs: string[] = [];
    
    // Teknik Cepat: Ekstrak nombor dari nama fail/metadata jika kamera menyokongnya, 
    // atau gunakan fungsi regex ringan terus pada buffer
    const fileNameOnly = file.name;
    const filenameMatches = fileNameOnly.match(/\b\d{3,5}\b/g);
    if (filenameMatches) {
      detectedBibs.push(...filenameMatches);
    }

    // 3. Upload Gambar Ke Cloudflare R2 (R2 percuma 10GB storage & 0 egress fee)
    const fileExtension = file.name.split('.').pop();
    const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageUrl = `https://${process.env.R2_BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${fileName}`;

    // 4. Simpan ke Supabase
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .insert({
        event_id: finalEventId,
        watermark_url: imageUrl,
        original_url: imageUrl,
        price: parseFloat(price as string),
        bib_numbers: Array.from(new Set(detectedBibs)),
      })
      .select()
      .single();

    if (photoError) throw photoError;

    return NextResponse.json({
      success: true,
      photo: photoData,
      detectedBibs: Array.from(new Set(detectedBibs)),
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memuat naik.' }, { status: 500 });
  }
}