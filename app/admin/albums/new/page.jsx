"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Tambah ni untuk redirect
import { Calendar, MapPin, DollarSign, Layers, Bell, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Setup Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CreateAlbumPage() {
  const router = useRouter(); // Hook untuk pindah page
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Draft');
  const [loading, setLoading] = useState(false);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Hantar data ke table 'events'
    const { data, error } = await supabase
      .from('events')
      .insert([
        { 
          title, 
          slug, 
          description, 
          status 
        }
      ]);

    if (error) {
      alert('Gagal mencipta album: ' + error.message);
      setLoading(false);
    } else {
      alert('Album berjaya dicipta!');
      router.push('/admin/albums'); // Kembali ke senarai album
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div>
        <Link href="/admin/albums" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </Link>
        <h1 className="text-2xl font-bold text-white">Create New Album</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">ALBUM TITLE *</label>
            <input type="text" required value={title} onChange={handleTitleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">SLUG *</label>
            <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">DESCRIPTION</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white focus:border-amber-500 outline-none" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl w-full transition-colors"
        >
          {loading ? 'Creating...' : <><Save className="w-4 h-4" /> Create Album</>}
        </button>
      </form>
    </div>
  );
}