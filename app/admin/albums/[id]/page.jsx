'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
// Import ikon pangkah untuk Modal
import { X } from 'lucide-react'; 

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminAlbumDetailPage() {
  const params = useParams();
  const albumId = params?.id;

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  // State untuk Modal Preview
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // 1. Tarik senarai gambar dari Supabase
  useEffect(() => {
    async function fetchPhotos() {
      if (!albumId) return;

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('album_id', albumId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ralat mengambil gambar:', error);
      } else {
        setPhotos(data || []);
      }
      setLoading(false);
    }

    fetchPhotos();
  }, [albumId]);

  return (
    <div className="p-8 text-white max-w-6xl mx-auto relative min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/admin/albums" className="text-sm text-zinc-400 hover:text-white mb-2 inline-block">
            ← Kembali ke Senarai Album
          </Link>
          <h1 className="text-2xl font-bold">Kandungan Album #{albumId}</h1>
        </div>

        <Link
          href={`/admin/albums/${albumId}/photos`}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition text-sm"
        >
          + Muat Naik Gambar
        </Link>
      </div>

      {/* --- KANDUNGAN UTAMA (Loading / Tiada Gambar / Grid) --- */}
      {loading ? (
        <p className="text-zinc-400">Sedang memuatkan gambar...</p>
      ) : photos.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 mb-4">Tiada gambar dalam album ini lagi.</p>
          <Link
            href={`/admin/albums/${albumId}/photos`}
            className="text-orange-500 underline text-sm"
          >
            Muat naik gambar sekarang
          </Link>
        </div>
      ) : (
        // --- GRID GAMBAR ---
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {photos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 cursor-pointer aspect-square"
              // Bila gambar diklik, simpan data photo ke state
              onClick={() => setSelectedPhoto(photo)} 
            >
              <img
                src={photo.url}
                alt={photo.title || 'Gambar Album'}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              {/* Overlay gelap bila hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-xs text-white font-medium bg-zinc-900/80 px-2 py-1 rounded">Klik untuk Preview</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL PREVIEW (Akan muncul bila selectedPhoto ada isi) --- */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          // Klik di luar gambar (di background) untuk tutup modal
          onClick={() => setSelectedPhoto(null)} 
        >
          {/* Butang Tutup (X) */}
          <button 
            className="absolute top-4 right-4 p-2 bg-zinc-900/80 text-white rounded-full hover:bg-zinc-700 transition"
            onClick={() => setSelectedPhoto(null)}
          >
            <X size={24} />
          </button>

          {/* Bekas Gambar (Prevent Click from closing) */}
          <div 
            className="relative max-w-5xl max-h-[90vh] flex flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()} // Supaya klik pada gambar tak tutup modal
          >
            <img 
              src={selectedPhoto.url} 
              alt={selectedPhoto.title || 'Preview'} 
              className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
            {/* Tajuk Gambar di bawah */}
            <p className="text-sm text-zinc-300 bg-zinc-900/70 px-3 py-1.5 rounded-full">
              {selectedPhoto.title || 'Untitled'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}