"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id;

  const [album, setAlbum] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbumDetails() {
      // 1. Ambil maklumat album
      const { data: albumData, error: albumError } = await supabase
        .from('events')
        .select('*')
        .eq('id', albumId)
        .single();

      if (albumError) {
        console.error('Error fetching album:', albumError.message);
      } else {
        setAlbum(albumData);
      }

      // 2. Ambil gambar-gambar dalam album (jika ada table photos)
      // Nota: Sesuaikan nama table jika table gambar anda berbeza (cth: 'photos')
      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('event_id', albumId);

      if (!photosError && photosData) {
        setPhotos(photosData);
      }

      setLoading(false);
    }

    if (albumId) {
      fetchAlbumDetails();
    }
  }, [albumId]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 p-4">
      {/* Butang Kembali ke Dashboard */}
      <div>
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>

      {/* Tajuk & Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {album ? album.title : 'Album Content'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Album ID: {albumId}
          </p>
        </div>

        <button
          onClick={() => alert('Fungsian muat naik gambar boleh diselaraskan di sini.')}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Kandungan Gambar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12 text-zinc-500 text-xs">
            Loading album contents...
          </div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group bg-zinc-800 rounded-xl overflow-hidden border border-zinc-700 aspect-square">
                <img src={photo.url} alt="Album photo" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">No photos uploaded in this album yet.</p>
            <p className="text-xs text-zinc-500">
              Upload photos now to populate this gallery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}