'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Folder, 
  MapPin, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Upload, 
  Plus, 
  Check 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminAlbumsPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchAlbums();

    // Auto-sync Realtime untuk jadual 'events'
    const channel = supabase
      .channel('public:events')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'events' }, () => {
        fetchAlbums();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchAlbums() {
    setLoading(true);
    // Diubah daripada 'albums' kepada 'events' mengikut jadual Supabase anda
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ralat mengambil album:', error);
    } else {
      setAlbums(data || []);
    }
    setLoading(false);
  }

  const handleCopyLink = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="p-6 md:p-8 bg-black min-h-screen text-white space-y-8 max-w-7xl mx-auto">
      
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Albums Management
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage all event photo albums. All settings and database links are unified.
          </p>
        </div>

        <a
          href="/admin/albums/new"
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" /> New Album
        </a>
      </div>

      {/* Senarai Kad Album */}
      {loading ? (
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-500 text-sm">
          Sedang memuatkan album...
        </div>
      ) : albums.length === 0 ? (
        <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-500 text-sm">
          Tiada album ditemui. Sila buat album baru untuk mula.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const albumUrl = typeof window !== 'undefined' ? `${window.location.origin}/events/${album.slug || album.id}` : '';
            const isCopied = copiedId === album.id;
            const isPublished = album.status?.toLowerCase() === 'published' || album.is_published;

            return (
              <div 
                key={album.id}
                className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between space-y-6 hover:border-zinc-700 transition"
              >
                {/* Bahagian Atas Kad */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs font-medium">
                      <Folder className="w-4 h-4 text-amber-500" />
                      <span>Official Event Cover</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      isPublished 
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' 
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}>
                      {isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white tracking-wide truncate">
                      {album.title || 'Untitled Album'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {album.event_date || 'Tarikh tidak ditetapkan'}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {album.location || 'No location'}
                      </span>
                    </div>
                  </div>

                  {/* Kotak Pautan URL */}
                  <div className="bg-black/40 border border-zinc-800 rounded-xl px-3 py-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-zinc-400 truncate font-mono">
                      {albumUrl}
                    </span>
                    <button
                      onClick={() => handleCopyLink(albumUrl, album.id)}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1 transition shrink-0"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-amber-500" />}
                      {isCopied ? 'Copied' : 'Copy Link'}
                    </button>
                  </div>
                </div>

                {/* Bahagian Bawah (Butang Tindakan) */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
                  <a
                    href={`/events/${album.slug || album.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-amber-500" /> View Gallery
                  </a>

                  <a
                    href={`/admin/albums/upload?id=${album.id}`}
                    className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition text-center"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}