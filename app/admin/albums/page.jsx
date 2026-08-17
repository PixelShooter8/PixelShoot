"use client";

import { useState } from 'react';
import { Plus, Search, Camera, Edit3, Upload, UserPlus, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminAlbumsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const [albums, setAlbums] = useState([
    {
      id: '1',
      title: 'Miri Half Marathon',
      slug: '/mirihalfmarathonbyjomrun',
      photos: 704,
      status: 'Published',
      coverUrl: null,
    },
    {
      id: '2',
      title: 'Test',
      slug: '/test',
      photos: 0,
      status: 'Draft',
      coverUrl: null,
    },
    {
      id: '3',
      title: 'Miri Half Marathon 2026 By JomRun',
      slug: '/miri-half-marathon-2026-by-jomrun',
      photos: 32,
      status: 'Published',
      coverUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=150&auto=format&fit=crop&q=80',
    },
  ]);

  const filteredAlbums = albums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, title) => {
    if (confirm(`Adakah anda pasti ingin memadam album "${title}"?`)) {
      setAlbums(albums.filter((a) => a.id !== id));
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-white">Albums</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Manage all your event photo albums.</p>
      </div>

      <Link
        href="/admin/albums/new"
        className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 px-4 rounded-full w-full transition-colors"
      >
        <Plus className="w-5 h-5" />
        <span>New Album</span>
      </Link>

      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search albums..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl divide-y divide-zinc-800/80 overflow-hidden">
        {filteredAlbums.length > 0 ? (
          filteredAlbums.map((album) => (
            <div key={album.id} className="p-5 space-y-4">
              <div className="flex items-start gap-3.5">
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-14 h-14 rounded-2xl object-cover shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-zinc-400 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <Link href={`/admin/albums/${album.id}`} className="flex items-start gap-3.5 group cursor-pointer">
  {album.coverUrl ? (
    <img src={album.coverUrl} alt={album.title} className="w-14 h-14 rounded-2xl object-cover shrink-0 group-hover:opacity-80 transition" />
  ) : (
    <div className="w-14 h-14 rounded-2xl bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center group-hover:bg-zinc-700 transition">
      <Camera className="w-6 h-6" />
    </div>
  )}

  <div className="space-y-1 min-w-0 flex-1">
    <h3 className="font-bold text-white text-base leading-snug truncate group-hover:underline">
      {album.title}
    </h3>
    <p className="text-xs text-zinc-500 truncate">{album.slug}</p>
  </div>
</Link>
                  
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-zinc-400">{album.photos} photos</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      album.status === 'Published'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    }`}>
                      {album.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Link href={`/admin/albums/${album.id}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 text-xs font-semibold text-zinc-200 transition-colors">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <Link href={`/admin/albums/${album.id}/photos`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/50 text-xs font-semibold text-zinc-200 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Photos</span>
                  </Link>

                  <Link href={`/admin/albums/${album.id}/invite`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 text-xs font-semibold transition-colors">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </Link>
                </div>

                <button
                  onClick={() => handleDelete(album.id, album.title)}
                  className="w-9 h-9 rounded-full bg-red-950/30 hover:bg-red-950/60 border border-red-900/50 flex items-center justify-center text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-zinc-500 text-sm">Tiada album dijumpai.</div>
        )}
      </div>
    </div>
  );
}