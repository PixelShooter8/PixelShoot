"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, Plus, Calendar, MapPin, DollarSign, Layers, Bell, Trash2 } from 'lucide-react';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function NewAlbumPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    price: '',
    status: 'Published',
    notify_photographer: true,
  });

  // State for Bundle Pricing Packages
  const [bundles, setBundles] = useState([
    { qty: 1, price: 16 },
    { qty: 3, price: 40 },
    { qty: 5, price: 85 }
  ]);

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

  const handleAddBundle = () => {
    setBundles([...bundles, { qty: '', price: '' }]);
  };

  const handleRemoveBundle = (index) => {
    const newBundles = bundles.filter((_, i) => i !== index);
    setBundles(newBundles);
  };

  const handleBundleChange = (index, field, value) => {
    const newBundles = [...bundles];
    newBundles[index][field] = value;
    setBundles(newBundles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Diselaraskan menggunakan jadual 'albums'
      const { error } = await supabase.from('albums').insert([
        {
          title: formData.title,
          slug: formData.slug,
          description: formData.description,
          event_date: formData.event_date,
          end_date: formData.end_date,
          location: formData.location,
          price: formData.price ? parseFloat(formData.price) : 0,
          status: formData.status,
          notify_photographer: formData.notify_photographer,
          pricing_bundles: bundles,
        },
      ]);

      if (error) throw error;

      alert('Album successfully created!');
      router.push('/admin/albums');
      router.refresh();
    } catch (err) {
      alert('Failed to create album: ' + err.message);
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-6 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">ALBUM TITLE *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleTitleChange}
            placeholder="e.g: Ali & Siti Wedding"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">URL SLUG *</label>
          <input
            type="text"
            name="slug"
            required
            value={formData.slug}
            onChange={handleChange}
            placeholder="ali-siti-wedding"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Dates & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> EVENT DATE
            </label>
            <input
              type="date"
              name="event_date"
              value={formData.event_date}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors [color-scheme:dark]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> END DATE
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> LOCATION
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g: Grand Ballroom, Kuala Lumpur"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Unit Price */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" /> DEFAULT PHOTO PRICE (RM)
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

        {/* Bundle Pricing Section */}
        <div className="space-y-3 pt-3 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-500" /> BUNDLE / PACKAGE PRICING
            </label>
            <button
              type="button"
              onClick={handleAddBundle}
              className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Package
            </button>
          </div>

          <div className="space-y-2">
            {bundles.map((bundle, index) => (
              <div key={index} className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="flex-1">
                  <span className="text-[10px] text-zinc-400 block mb-1 uppercase font-semibold">Quantity (Photos)</span>
                  <input
                    type="number"
                    placeholder="e.g: 3"
                    value={bundle.qty}
                    onChange={(e) => handleBundleChange(index, 'qty', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] text-zinc-400 block mb-1 uppercase font-semibold">Package Price (RM)</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g: 40"
                    value={bundle.price}
                    onChange={(e) => handleBundleChange(index, 'price', e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveBundle(index)}
                  className="mt-5 text-zinc-500 hover:text-red-400 p-2 transition-colors"
                  title="Remove package"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-300">DESCRIPTION</label>
          <textarea
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Additional information about the event..."
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
              <option value="Published">Published (Active)</option>
              <option value="Draft">Draft (Hidden)</option>
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
                <Bell className="w-3.5 h-3.5 text-amber-500" /> Notify me when photos are uploaded
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{loading ? 'Creating Album...' : 'Save & Create Album'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}