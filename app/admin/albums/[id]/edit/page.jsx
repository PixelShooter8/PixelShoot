"use client";

import { useState, useEffect } from 'react';
import { Calendar, MapPin, DollarSign, Layers, Bell, Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditAlbumPage({ params }) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [defaultPrice, setDefaultPrice] = useState('5.00');
  const [enableVolumePricing, setEnableVolumePricing] = useState(false);
  const [status, setStatus] = useState('Published');
  const [emailNotify, setEmailNotify] = useState('No');

  // Load data asal album mengikut params.id
  useEffect(() => {
    // Simulasi data album sedia ada
    setTitle('Miri Half Marathon 2026');
    setSlug('miri-half-marathon-2026-by-jomrun');
    setDescription('Acara larian marathon rasmi di Miri.');
    setStartDate('2026-07-04');
    setEndDate('2026-07-05');
    setLocation('Miri, Sarawak');
    setDefaultPrice('5.00');
    setStatus('Published');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      id: params.id,
      title,
      slug,
      description,
      startDate,
      endDate,
      location,
      defaultPrice,
      enableVolumePricing,
      status,
      emailNotify,
    };
    console.log('Data Album Dikemaskini:', updatedData);
    alert('Maklumat album berjaya dikemaskini!');
  };

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

        {/* PRICING & STATUS */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-5">
          <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase">PRICING & STATUS</p>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> DEFAULT PHOTO PRICE (RM)
            </label>
            <input
              type="number"
              step="0.01"
              value={defaultPrice}
              onChange={(e) => setDefaultPrice(e.target.value)}
              className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500"
            />
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
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}