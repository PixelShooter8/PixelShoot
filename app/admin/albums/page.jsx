"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Plus, Folder, Calendar, MapPin, Edit3 } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Ralat memuatkan album:', error.message);
      } else {
        setAlbums(data || []);
      }
      setLoading(false);
    }

    fetchAlbums();
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Albums</h1>
          <p className="text-sm text-zinc-400">Manage all your event photo albums.</p>
        </div>
        <Link
          href="/admin/albums/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Album
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Memuatkan album...</p>
      ) : albums.length === 0 ? (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center text-zinc-500">
          <Folder className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>Tiada album dijumpai.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {albums.map((album) => (
            <Link
              key={album.id}
              href={`/admin/albums/${album.id}/edit`}
              className="bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 transition-all block group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                    {album.title}
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">Slug: /album/{album.slug}</p>
                </div>
                <span className="bg-zinc-800 group-hover:bg-amber-500 group-hover:text-black text-zinc-300 p-2 rounded-xl text-xs transition-colors">
                  <Edit3 className="w-4 h-4" />
                </span>
              </div>

              <p className="text-sm text-zinc-300 line-clamp-2">
                {album.description || 'Tiada penerangan'}
              </p>

              <div className="flex items-center gap-4 text-xs text-zinc-400 pt-2 border-t border-zinc-800/80">
                {album.event_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {album.event_date}
                  </span>
                )}
                {album.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {album.location}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}