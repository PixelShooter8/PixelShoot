"use client";

import { useState } from 'react';
import { Folder, Calendar, MapPin, Edit3, Trash2, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function RecentAlbumsSection() {
  // Contoh data album
  const [albums, setAlbums] = useState([
    {
      id: '1',
      title: 'Sarawak Marathon 2026',
      slug: 'sarawak-marathon-2026',
      date: '09 Julai 2026',
      location: 'Kuching, Sarawak',
      photosCount: 240,
      status: 'Published',
    },
    {
      id: '2',
      title: 'Kuching Night Run 2026',
      slug: 'kuching-night-run-2026',
      date: '15 Ogos 2026',
      location: 'Kuching, Sarawak',
      photosCount: 0,
      status: 'Draft',
    },
    {
      id: '3',
      title: 'Borneo Cycling Challenge',
      slug: 'borneo-cycling-challenge',
      date: '02 September 2026',
      location: 'Miri, Sarawak',
      photosCount: 0,
      status: 'Draft',
    },
  ]);

  // Fungsi padam album
  const handleDelete = (id, title) => {
    if (confirm(`Adakah anda pasti ingin memadam album "${title}"?`)) {
      setAlbums(albums.filter((album) => album.id !== id));
      alert('Album berjaya dipadam.');
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
      {/* Header Seksyen */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-500" />
            <span>Recent Albums</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Senarai album yang telah diterbitkan atau tersimpan sebagai draf.
          </p>
        </div>

        <Link
          href="/admin/albums/new"
          className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Album</span>
        </Link>
      </div>

      {/* Senarai Album */}
      <div className="space-y-3">
        {albums.length > 0 ? (
          albums.map((album) => (
            <div
              key={album.id}
              className="bg-zinc-800/50 hover:bg-zinc-800/80 border border-zinc-700/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
            >
              {/* Maklumat Album */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-white text-sm">
                    {album.title}
                  </h3>
                  
                  {/* Status Tag */}
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      album.status === 'Published'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {album.status === 'Draft' ? 'Draft — Event Lambat Lagi' : 'Published'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                    {album.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    {album.location}
                  </span>
                  <span>•</span>
                  <span>{album.photosCount} Gambar</span>
                </div>
              </div>

              {/* Butang Tindakan (Edit & Delete) */}
              <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-zinc-700/50 pt-3 sm:pt-0">
                <Link
                  href={`/admin/albums/${album.id}/edit`}
                  title="Edit Album"
                  className="flex items-center gap-1.5 bg-zinc-700/60 hover:bg-zinc-700 text-zinc-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Link>

                <button
                  onClick={() => handleDelete(album.id, album.title)}
                  title="Delete Album"
                  className="flex items-center gap-1.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-zinc-500 text-xs">
            Tiada album ditemui. Klik "New Album" untuk mula mencipta.
          </div>
        )}
      </div>
    </div>
  );
}