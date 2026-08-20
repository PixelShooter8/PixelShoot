import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Hantar terus gambar ke server Python (Hetzner / Localhost 8000)
    // Server Python anda nanti yang akan uruskan Cloudflare R2 dengan selamat.
    const pythonResponse = await fetch('http://127.0.0.1:8000/process-photo', {
      method: 'POST',
      body: formData,
    });

    const aiData = await pythonResponse.json();

    if (!pythonResponse.ok) {
      throw new Error('Gagal berhubung dengan server AI Python.');
    }

    return NextResponse.json({
      success: true,
      imageUrl: aiData.image_url || 'https://example.com/placeholder.jpg',
      detectedBibs: aiData.detected_bibs || [],
      facesDetected: aiData.faces_detected || 1,
    });

  } catch (error: any) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: error.message || 'Gagal memuat naik.' }, { status: 500 });
  }
}