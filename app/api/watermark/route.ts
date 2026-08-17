import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { fileName } = await req.json();

    if (!fileName) {
      return NextResponse.json({ error: 'Nama fail diperlukan' }, { status: 400 });
    }

    // 1. Muat turun gambar asal
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('photo-original')
      .download(fileName);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Gagal muat turun gambar asal' }, { status: 500 });
    }

    const inputBuffer = Buffer.from(await fileData.arrayBuffer());

    // Dapatkan dimensi asal gambar
    const metadata = await sharp(inputBuffer).metadata();
    const width = metadata.width || 800;
    const height = metadata.height || 600;

    // 2. Bina Watermark SVG dinamik mengikut saiz gambar
    const fontSize = Math.floor(width * 0.06); // Saiz teks 6% daripada lebar gambar
    const watermarkSvg = Buffer.from(`
      <svg width="${width}" height="${height}">
        <style>
          .watermark-text {
            fill: rgba(255, 255, 255, 0.7);
            font-size: ${fontSize}px;
            font-family: Arial, sans-serif;
            font-weight: bold;
          }
        </style>
        <!-- Watermark di tengah-tengah gambar -->
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" class="watermark-text">
          PIXELSHOOTER
        </text>
      </svg>
    `);

    const processedBuffer = await sharp(inputBuffer)
      .composite([{ input: watermarkSvg, top: 0, left: 0 }])
      .jpeg({ quality: 85 })
      .toBuffer();

    // 3. Simpan ke bucket photo-preview
    const { error: uploadError } = await supabase.storage
      .from('photo-preview')
      .upload(`preview_${fileName}`, processedBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: 'Watermark berjaya ditambah!',
      previewPath: `preview_${fileName}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}