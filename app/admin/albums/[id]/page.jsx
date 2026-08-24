'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Upload, Image as ImageIcon, Trash2, CheckSquare, Square, X } from 'lucide-react';

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
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  useEffect(() => {
    async function fetchAlbumDetails() {
      const { data: albumData, error: albumError } = await supabase
        .from('events')
        .select('*')
        .eq('id', albumId)
        .single();

      if (!albumError) setAlbum(albumData);

      const { data: photosData, error: photosError } = await supabase
        .from('photos')
        .select('*')
        .eq('event_id', albumId);

      if (!photosError && photosData) {
        const formattedPhotos = photosData.map((p) => ({
          ...p,
          displayUrl: p.watermark_url || p.original_url || p.image_url || p.url || '',
        }));
        setPhotos(formattedPhotos);
      }
      setLoading(false);
    }

    if (albumId) fetchAlbumDetails();
  }, [albumId]);

  // Fungsi Pilih Gambar (Checkbox)
  const toggleSelectPhoto = (id) => {
    setSelectedPhotos((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Fungsi Padam Gambar Tunggal
  const handleDeletePhoto = async (photoId) => {
    if (!confirm('Adakah anda pasti mahu memadam gambar ini?')) return;

    const { error } = await supabase.from('photos').delete().eq('id', photoId);
    if (!error) {
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      setSelectedPhotos((prev) => prev.filter((id) => id !== photoId));
    } else {
      alert('Ralat memadam gambar: ' + error.message);
    }
  };

  // Fungsi Padam Gambar Terpilih (Bulk Delete)
  const handleDeleteSelected = async () => {
    if (selectedPhotos.length === 0) return;
    if (!confirm(`Padam ${selectedPhotos.length} gambar terpilih?`)) return;

    const { error } = await supabase.from('photos').delete().in('id', selectedPhotos);
    if (!error) {
      setPhotos((prev) => prev.filter((p) => !selectedPhotos.includes(p.id)));
      setSelectedPhotos([]);
    } else {
      alert('Ralat memadam gambar terpilih: ' + error.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 p-4">
      {/* Butang Kembali */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/admin/albums')}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Albums</span>
        </button>

        {selectedPhotos.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Selected ({selectedPhotos.length})</span>
          </button>
        )}
      </div>

      {/* Header & Upload */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">
            {album ? album.title : 'Album Content'}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Album ID: {albumId}</p>
        </div>

        <button
          onClick={() => router.push(`/admin/albums/upload?id=${albumId}`)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Photos</span>
        </button>
      </div>

      {/* Senarai Gambar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6">
        {loading ? (
          <div className="text-center py-12 text-zinc-500 text-xs">Loading album contents...</div>
        ) : photos.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((photo) => {
              const isSelected = selectedPhotos.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  className={`relative group bg-zinc-800 rounded-xl overflow-hidden border transition-all aspect-square flex items-center justify-center ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-500/50' : 'border-zinc-700'
                  }`}
                >
                  {/* Gambar (Klik untuk Zoom) */}
                  <img
                    src={photo.displayUrl}
                    alt={`BIB ${photo.bib || 'Photo'}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => setZoomImage(photo.displayUrl)}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2371717a" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>';
                    }}
                  />

                  {/* Checkbox Pilih (Top Left) */}
                  <button
                    onClick={() => toggleSelectPhoto(photo.id)}
                    className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Square className="w-4 h-4 text-zinc-300" />
                    )}
                  </button>

                  {/* Butang Padam (Top Right) */}
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Label BIB (Bottom) */}
                  {photo.bib && (
                    <span className="absolute bottom-2 left-2 bg-black/75 px-2 py-0.5 rounded text-[10px] font-bold text-amber-400">
                      BIB #{photo.bib}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <ImageIcon className="w-10 h-10 text-zinc-600 mx-auto" />
            <p className="text-zinc-400 text-sm">No photos uploaded in this album yet.</p>
          </div>
        )}
      </div>

      {/* Modal Zoom Gambar */}
      {zoomImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomImage(null)}
        >
          <button 
            onClick={() => setZoomImage(null)}
            className="absolute top-6 right-6 text-zinc-400 hover:text-white bg-zinc-800/80 p-2 rounded-full cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={zoomImage} 
            alt="Zoomed preview" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl"
          />
        </div>
      )}
    </div>
  );
}