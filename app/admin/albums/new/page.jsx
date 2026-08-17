"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, Tag, Bell } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewAlbumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State untuk semua medan borang
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    event_date: '',
    location: '',
    price: '',
    bundle_price: '',
    status: 'Published',
    notify_photographer: true,
  });

  // Fungsi automatik tukar Tajuk jadi Slug (cth: "Majlis Kahwin" -> "majlis-kahwin")
  const handleTitleChange = (e) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData({
      ...formData,
      title: val,
      slug: generatedSlug,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('events').insert([
        {
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          event_date: formData.event_date,
          location: formData.location,
          price: formData.price ? parseFloat(formData.price) : 0,
          bundle_price: formData.bundle_price ? parseFloat(formData.bundle_price) : 0,
          status: formData.status,
          notify_photographer: formData.notify_photographer,
        },
      ]);

      if (error) throw error;

      alert('Album berjaya dicipta!');
      router.push('/admin/albums');
      router.refresh();
    } catch (err) {
      alert('Gagal mencipta album: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/albums"
          className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 p-2 rounded-xl text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Album</h1>
          <p className="text-sm text-zinc-400">Add a new event photo album and pricing details.</p>
        </div>
      </div>

      {/* Borang */}
      <form onSubmit={handleSubmit} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-5">
        {/* Tajuk */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">TAJUK ALBUM *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="Cth: Majlis Perkahwinan Ali & Siti"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">SLUG (URL Web) *</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            placeholder="majlis-perkahwinan-ali-siti"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Tarikh & Tempat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> TARIKH EVENT
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" /> TEMPAT / LOKASI
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Cth: Dewan Seri Melaka"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Harga Jualan & Harga Bundle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-500" /> HARGA SEUNIT (RM)
            </label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-amber-500" /> HARGA BUNDLE / PAKEJ (RM)
            </label>
            <input
              type="number"
              step="0.01"
              name="bundle_price"
              value={formData.bundle_price}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Penerangan */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">PENERANGAN</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Maklumat tambahan mengenai event..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Status & Notify Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-zinc-800">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300">STATUS</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="Published">Published (Aktif)</option>
              <option value="Draft">Draft (Simpan Dulu)</option>
            </select>
          </div>

          <div className="flex items-center pt-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="notify_photographer"
                checked={formData.notify_photographer}
                onChange={handleChange}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-500" /> Notify me bila gambar upload
              </span>
            </label>
          </div>
        </div>

        {/* Butang Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Menyiapkan Album...' : 'Simpan & Cipta Album'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}