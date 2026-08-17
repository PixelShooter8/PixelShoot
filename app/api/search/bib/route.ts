import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bib = searchParams.get('bib');

    if (!bib) {
      return NextResponse.json({ error: 'Sila berikan nombor BIB.' }, { status: 400 });
    }

    // Cari gambar yang mengandungi nombor BIB ini dalam tatasusunan bib_numbers
    const { data: photos, error } = await supabase
      .from('photos')
      .select('*')
      .contains('bib_numbers', [bib.trim()]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, photos });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}