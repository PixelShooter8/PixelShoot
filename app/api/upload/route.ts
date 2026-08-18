import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { r2Client } from '@/lib/r2';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const eventSlug = formData.get('eventId') as string; // Dalam UI ini dipanggil eventId tapi bernilai slug (maraton-kuching-2026)
    const price = formData.get('price') || '15.00';

    if (!file || !eventSlug) {
      return NextResponse.json(
        { error: 'Fail gambar atau ID Event tidak lengkap.' },
        { status: 400 }
      );
    }

    // 1. CARI UUID EVENT BERDASARKAN SLUG
    let { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('id')
      .eq('slug', eventSlug)
      .single();

    // Jika event belum wujud, kita cipta sementara untuk mengelakkan ralat UUID
    let finalEventId = eventData?.id;
    if (eventError || !finalEventId) {
      const { data: newEvent } = await supabase
        .from('events')
        .insert({ slug: eventSlug, title: `Acara ${eventSlug}` })
        .select('id')
        .single();
      
      finalEventId = newEvent?.id;
      
      if (!finalEventId) {
         throw new Error(`Gagal mencari atau mencipta Acara untuk slug: ${eventSlug}`);
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${eventSlug}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // 2. UPLOAD KEPADA CLOUDFLARE R2
    const uploadCommand = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(uploadCommand);

    // 3. BINA PUBLIC URL MENGGUNAKAN R2_PUBLIC_URL (DIKEMASKINI)
    // Guna R2_PUBLIC_URL jika ada, jika tidak guna fallback URL lama
    const publicDomain = process.env.R2_PUBLIC_URL || `https://${process.env.R2_BUCKET_NAME}.${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const imageUrl = `${publicDomain}/${fileName}`;

    // 4. HANTAR KE PYTHON AI MICROSERVICE (Auto OCR BIB & Face Vector)
    let detectedBibs: string[] = [];
    let faceEmbeddings: number[][] = [];

    try {
      const aiFormData = new FormData();
      aiFormData.append('file', new Blob([buffer]), file.name);

      const aiResponse = await fetch(`${process.env.PYTHON_AI_SERVICE_URL}/process-photo`, {
        method: 'POST',
        body: aiFormData,
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        detectedBibs = aiData.bib_numbers || [];
        faceEmbeddings = aiData.face_embeddings || [];
      }
    } catch (aiErr) {
      console.warn('AI Microservice offline/error, upload diteruskan tanpa AI:', aiErr);
    }

    // 5. SIMPAN DATA GAMBAR KE SUPABASE
    const { data: photoData, error: photoError } = await supabase
      .from('photos')
      .insert({
        event_id: finalEventId, // Gunakan UUID yang sah, bukan slug
        watermark_url: imageUrl,
        original_url: imageUrl,
        price: parseFloat(price as string),
        bib_numbers: detectedBibs,
      })
      .select()
      .single();

    if (photoError) {
      throw photoError;
    }

    // 6. SIMPAN VECTOR MUKA KE SUPABASE
    if (faceEmbeddings.length > 0 && photoData) {
      const faceRecords = faceEmbeddings.map((embedding) => ({
        photo_id: photoData.id,
        face_embedding: embedding,
      }));

      await supabase.from('photo_faces').insert(faceRecords);
    }

    return NextResponse.json({
      success: true,
      photo: photoData,
      detectedBibs,
      facesDetected: faceEmbeddings.length,
    });
  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json(
      { error: error.message || 'Gagal memuat naik gambar.' },
      { status: 500 }
    );
  }
}