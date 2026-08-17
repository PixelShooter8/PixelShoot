"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Plus, Folder } from 'lucide-react';

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
            <div key={album.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2">
              <h2 className="text-lg font-bold text-white">{album.title}</h2>
              <p className="text-xs text-zinc-400">Slug: /album/{album.slug}</p>
              <p className="text-sm text-zinc-300">{album.description || 'Tiada penerangan'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}