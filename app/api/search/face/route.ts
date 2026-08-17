import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Sila muat naik gambar selfie.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // 1. Hantar gambar selfie ke Python AI Microservice untuk ekstrak Vector Muka
    let queryEmbedding: number[] = [];
    try {
      const aiFormData = new FormData();
      aiFormData.append('file', new Blob([buffer]), file.name);

      const aiResponse = await fetch(`${process.env.PYTHON_AI_SERVICE_URL}/extract-face`, {
        method: 'POST',
        body: aiFormData,
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        queryEmbedding = aiData.embedding;
      }
    } catch (aiErr) {
      console.warn('AI Microservice offline:', aiErr);
      return NextResponse.json({ error: 'Servis AI carian muka tidak responsif.' }, { status: 500 });
    }

    if (!queryEmbedding || queryEmbedding.length === 0) {
      return NextResponse.json({ photos: [] }); // Tiada muka dikesan dalam selfie
    }

    // 2. Lakukan carian persaman Vector (Cosine Similarity) di Supabase
    const { data: matchedFaces, error } = await supabase.rpc('match_photos_by_face', {
      query_embedding: queryEmbedding,
      match_threshold: 0.6, // Ambil tahap kesepadanan 60% ke atas
      match_count: 20,
    });

    if (error) {
      throw error;
    }

    // Ambil photo_id yang unik
    const photoIds = Array.from(new Set(matchedFaces.map((f: any) => f.photo_id)));

    // Dapatkan maklumat gambar dari jadual photos
    const { data: photos } = await supabase
      .from('photos')
      .select('*')
      .in('id', photoIds);

    return NextResponse.json({ success: true, photos: photos || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}