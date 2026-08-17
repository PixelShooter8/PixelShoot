"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Folder, 
  Calendar, 
  MapPin, 
  Edit3, 
  Trash2, 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  HardDrive 
} from 'lucide-react';

export default function AdminDashboardPage() {
  // State untuk senarai Recent Albums
  const [albums, setAlbums] = useState([]);

  // Fungsi Padam Album
  const handleDeleteAlbum = (id, title) => {
    if (confirm(`Adakah anda pasti ingin memadam album "${title}"?`)) {
      setAlbums(albums.filter((album) => album.id !== id));
      alert('Album berjaya dipadam.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Header Dashboard */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Welcome to the admin dashboard. Here you can manage albums, view orders, and monitor photographers.
          </p>
        </div>
        <Link
          href="/admin/albums/new"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Album</span>
        </Link>
      </div>

      {/* 2. Menu Quick Stats / Navigation Kad */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/admin/orders" className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl transition-all">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold">Orders & Revenue</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">RM 0.00</p>
          <p className="text-[11px] text-zinc-500 mt-1">0 Paid / 0 Pending</p>
        </Link>

        <Link href="/admin/photographers" className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 p-4 rounded-2xl transition-all">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-xs font-semibold">Photographers</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-[11px] text-zinc-500 mt-1">Registered Photographer</p>
        </Link>
      </div>

      {/* 3. SEKSYEN RECENT ALBUMS (Diletakkan di bahagian bawah) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
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
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        album.status === 'Published'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
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

                {/* Butang Edit & Delete */}
                <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-zinc-700/50 pt-3 sm:pt-0">
                  <Link
                    href={`/admin/albums/${album.id}/edit`}
                    className="flex items-center gap-1.5 bg-zinc-700/60 hover:bg-zinc-700 text-zinc-200 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </Link>

                  <button
                    onClick={() => handleDeleteAlbum(album.id, album.title)}
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
              Tiada album ditemui.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}