"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Calendar, MapPin, DollarSign, Layers, Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function EditAlbumPage({ params }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('20.00');
  const [status, setStatus] = useState('Published');

  // State untuk Senarai Harga Bundle (Pakej)
  const [bundles, setBundles] = useState([
    { qty: 1, price: 20 },
    { qty: 3, price: 55 },
    { qty: 5, price: 85 }
  ]);

  // Load data asal album dari Supabase mengikut params.id
  useEffect(() => {
    async function fetchAlbumData() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;

        if (data) {
          setTitle(data.title || '');
          setSlug(data.slug || '');
          setDescription(data.description || '');
          setStartDate(data.event_date || '');
          setEndDate(data.end_date || '');
          setLocation(data.location || '');
          setDefaultPrice(data.price ? data.price.toString() : '20.00');
          setStatus(data.status || 'Published');
          if (data.pricing_bundles && Array.isArray(data.pricing_bundles)) {
            setBundles(data.pricing_bundles);
          }
        }
      } catch (err) {
        console.error('Ralat memuatkan data album:', err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumData();
  }, [params.id]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    setSlug(generatedSlug);
  };

  // Fungsi tambah baris bundle baru
  const handleAddBundle = () => {
    setBundles([...bundles, { qty: '', price: '' }]);
  };

  // Fungsi padam baris bundle
  const handleRemoveBundle = (index) => {
    const newBundles = bundles.filter((_, i) => i !== index);
    setBundles(newBundles);
  };

  // Fungsi ubah nilai bundle
  const handleBundleChange = (index, field, value) => {
    const newBundles = [...bundles];
    newBundles[index][field] = value;
    setBundles(newBundles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('events')
        .update({
          title,
          slug,
          description,
          event_date: startDate,
          end_date: endDate,
          location,
          price: parseFloat(defaultPrice) || 0,
          status,
          pricing_bundles: bundles,
        })
        .eq('id', params.id);

      if (error) throw error;

      alert('Maklumat album berjaya dikemaskini!');
      router.push('/admin/albums');
      router.refresh();
    } catch (err) {
      alert('Gagal mengemaskini album: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-400 text-sm">Memuatkan maklumat album...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <Link href="/admin/albums" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Senarai Album
        </Link>
        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">EDIT ALBUM #{params.id}</p>
        <h1 className="text-2xl font-bold text-white mt-1">Edit Event Album</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* BASIC INFO */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase">BASIC INFO</p>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
              ALBUM TITLE <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
              URL SLUG <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3">
              <span className="text-sm text-zinc-500 select-none mr-1">/album/</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">DESCRIPTION</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>
        </div>

        {/* EVENT DETAILS */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
          <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase">EVENT DETAILS</p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> EVENT DATE
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> END DATE
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 [color-scheme:dark]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> LOCATION
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* PRICING & BUNDLE */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase">PRICING & PACKAGES</p>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> DEFAULT PHOTO PRICE (RM - Seunit)
            </label>
            <input
              type="number"
              step="0.01"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Bahagian Tetapan Harga Bundle */}
          <div className="space-y-3 pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-zinc-300 uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" /> HARGA BUNDLE / PAKEJ GAMBAR
              </label>
              <button
                type="button"
                onClick={handleAddBundle}
                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Pakej
              </button>
            </div>

            <div className="space-y-2">
              {bundles.map((bundle, index) => (
                <div key={index} className="flex items-center gap-3 bg-zinc-800/40 p-3 rounded-xl border border-zinc-800">
                  <div className="flex-1">
                    <span className="text-[10px] text-zinc-400 block mb-1 uppercase font-semibold">Jumlah Gambar</span>
                    <input
                      type="number"
                      placeholder="Cth: 3"
                      value={bundle.qty}
                      onChange={(e) => handleBundleChange(index, 'qty', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-zinc-400 block mb-1 uppercase font-semibold">Harga Pakej (RM)</span>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Cth: 55"
                      value={bundle.price}
                      onChange={(e) => handleBundleChange(index, 'price', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveBundle(index)}
                    className="mt-5 text-zinc-500 hover:text-red-400 p-2 transition-colors"
                    title="Padam pakej"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">ALBUM STATUS</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            >
              <option value="Draft">Draft — Hidden from public</option>
              <option value="Published">Published — Visible to public</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <Link
            href="/admin/albums"
            className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Menyimpan...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}