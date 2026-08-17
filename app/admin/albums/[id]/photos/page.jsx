'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminUploadPhotosPage() {
  const params = useParams();
  const albumId = params?.id; // Mengambil album_id daripada URL (contoh: /admin/albums/1/photos)

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Sila pilih fail gambar dahulu!');
      return;
    }

    setUploading(true);
    setMessage('Mendapatkan kebenaran muat naik...');

    try {
      // 1. Dapatkan Presigned URL daripada R2 API Route
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal dapatkan Presigned URL');
      }

      setMessage('Sedang muat naik gambar ke Cloudflare R2...');

      // 2. Muat naik fail secara terus ke Cloudflare R2
      const uploadRes = await fetch(data.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error('Gagal memuat naik fail ke Cloudflare R2.');
      }

      setMessage('Simpan maklumat gambar ke Supabase...');

      // 3. Simpan URL gambar dan album_id ke pangkalan data Supabase
      const { data: photoData, error: dbError } = await supabase
        .from('photos') // Pastikan nama jadual dalam Supabase anda betul
        .insert([
          {
            album_id: albumId,
            url: data.publicUrl,
            title: file.name,
          },
        ]);

      if (dbError) {
        throw new Error(`Gambar muat naik ke R2 tetapi gagal simpan ke DB: ${dbError.message}`);
      }

      setMessage('Berjaya! Gambar muat naik ke R2 & rekod disimpan di Supabase.');
      alert('Gambar berjaya dimuat naik ke R2 dan disimpan ke Supabase!');
      setFile(null);

    } catch (err) {
      console.error('❌ Ralat Muat Naik/Simpan:', err);
      setMessage(`Gagal: ${err.message}`);
      alert(`Gagal: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto text-white bg-neutral-900 rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-6">Muat Naik Gambar (Album #{albumId})</h1>

      <form onSubmit={handleUpload} className="flex flex-col gap-6">
        <div className="border-2 border-dashed border-gray-600 p-8 rounded-lg text-center flex flex-col items-center justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mb-4 text-sm text-gray-300"
          />
          <p className="text-gray-400 text-sm">Pilih atau seret gambar ke sini</p>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg disabled:bg-gray-600 transition"
        >
          {uploading ? 'Sedang Memproses...' : 'Muat Naik & Simpan'}
        </button>
      </form>

      {message && <p className="mt-4 text-center text-sm font-medium text-amber-400">{message}</p>}
    </div>
  );
}