'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  Eye, 
  Search, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Folder,
  Calendar,
  ImageIcon,
  Download
} from 'lucide-react';

export default function SalesReportPage() {
  const [albums] = useState([
    {
      id: 'alb-001',
      title: 'Maraton Kuching 2026',
      date: '12 Ogos 2026',
      totalPhotos: 1250,
      pricePerPhoto: 15,
      platformFeePercent: 10,
      views: 3420,
      bibSearches: 1850,
      selfieSearches: 940,
      photosSold: 142,
    },
    {
      id: 'alb-002',
      title: 'Acara Larian Trail Santubong',
      date: '01 Ogos 2026',
      totalPhotos: 820,
      pricePerPhoto: 12,
      platformFeePercent: 10,
      views: 1980,
      bibSearches: 920,
      selfieSearches: 610,
      photosSold: 88,
    },
  ]);

  // Kiraan Keseluruhan (Overall Totals)
  const totalViews = albums.reduce((acc, alb) => acc + alb.views, 0);
  const totalSearches = albums.reduce((acc, alb) => acc + alb.bibSearches + alb.selfieSearches, 0);
  const totalPhotosSold = albums.reduce((acc, alb) => acc + alb.photosSold, 0);
  const totalGrossSales = albums.reduce((acc, alb) => acc + (alb.photosSold * alb.pricePerPhoto), 0);

  // --- FUNGSI EXPORT TO CSV (ALL ALBUMS) ---
  const exportAllToCSV = () => {
    const headers = [
      "ID Album,Nama Album,Tarikh,Jumlah Gambar,Harga Per Foto (RM),Views,Carian Bib,Carian Selfie,Gambar Terjual,Gross Sales (RM),Platform Fee (10%) (RM),Nett Sales (RM)"
    ];

    const rows = albums.map(alb => {
      const gross = alb.photosSold * alb.pricePerPhoto;
      const fee = (gross * alb.platformFeePercent) / 100;
      const nett = gross - fee;
      return `"${alb.id}","${alb.title}","${alb.date}",${alb.totalPhotos},${alb.pricePerPhoto},${alb.views},${alb.bibSearches},${alb.selfieSearches},${alb.photosSold},${gross.toFixed(2)},${fee.toFixed(2)},${nett.toFixed(2)}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_Jualan_PixelShoot_Semua_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- FUNGSI EXPORT TO CSV (SINGLE ALBUM) ---
  const exportSingleAlbumToCSV = (album) => {
    const gross = album.photosSold * album.pricePerPhoto;
    const fee = (gross * album.platformFeePercent) / 100;
    const nett = gross - fee;

    const csvData = [
      ["Laporan Jualan Album - " + album.title],
      ["Tarikh", album.date],
      ["Jumlah Gambar", album.totalPhotos],
      ["Harga / Gambar", "RM " + album.pricePerPhoto],
      [""],
      ["Metrik", "Nilai"],
      ["Views (Tontonan)", album.views],
      ["Carian Bib", album.bibSearches],
      ["Carian Selfie", album.selfieSearches],
      ["Jumlah Gambar Terjual", album.photosSold],
      ["Gross Sales", "RM " + gross.toFixed(2)],
      ["Platform Fee (" + album.platformFeePercent + "%)", "RM " + fee.toFixed(2)],
      ["Nett Sales", "RM " + nett.toFixed(2)]
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_${album.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 bg-black min-h-screen text-white space-y-8 max-w-7xl mx-auto">
      
      {/* Header Page + Butang Export CSV Utama */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <BarChart3 className="w-6 h-6 text-amber-500 shrink-0" />
            Sales Report & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Prestasi jualan, tontonan, dan carian imej mengikut album.
          </p>
        </div>

        <button
          onClick={exportAllToCSV}
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export Semua CSV (Excel)
        </button>
      </div>

      {/* Ringkasan Keseluruhan (Top Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jumlah Views</span>
            <Eye className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalViews.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Tontonan galeri keseluruhan</p>
          </div>
        </div>

        {/* Total Searches */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jumlah Carian</span>
            <Search className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalSearches.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Guna Nombor Bib & Selfie</p>
          </div>
        </div>

        {/* Photos Sold */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gambar Terjual</span>
            <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalPhotosSold}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Unit gambar didownload</p>
          </div>
        </div>

        {/* Total Gross Sales */}
        <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-4 md:p-5 flex flex-col justify-between bg-gradient-to-br from-amber-500/10 via-transparent to-transparent">
          <div className="flex justify-between items-center text-amber-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Gross Sales</span>
            <DollarSign className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-amber-500">RM {totalGrossSales.toFixed(2)}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">Jumlah jualan kasar</p>
          </div>
        </div>

      </div>

      {/* Senarai Laporan Mengikut Album */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Laporan Mengikut Album
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {albums.map((album) => {
            const grossSales = album.photosSold * album.pricePerPhoto;
            const platformFee = (grossSales * album.platformFeePercent) / 100;
            const nettSales = grossSales - platformFee;
            const totalSearchesAlbum = album.bibSearches + album.selfieSearches;

            return (
              <div 
                key={album.id}
                className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 md:p-6 hover:border-zinc-700 transition space-y-6"
              >
                {/* Header Album */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                  <div className="flex items-center gap-3.5 overflow-hidden">
                    <div className="bg-amber-500/10 text-amber-500 p-2.5 md:p-3 rounded-xl border border-amber-500/20 shrink-0">
                      <Folder className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-base md:text-lg font-bold text-white truncate">{album.title}</h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1">
                        <span className="flex items-center gap-1 shrink-0">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {album.date}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                          <ImageIcon className="w-3.5 h-3.5 text-zinc-500" /> {album.totalPhotos} gambar
                        </span>
                        <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-medium shrink-0">
                          RM {album.pricePerPhoto}/foto
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Butang Export CSV Album Spesifik */}
                  <button
                    onClick={() => exportSingleAlbumToCSV(album)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition shrink-0 self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-500" /> Export Album CSV
                  </button>
                </div>

                {/* Grid Statistik Album (Responsif: 1 -> 2 -> 5 Kolum) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                  
                  {/* Views */}
                  <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                      <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Views
                    </p>
                    <div className="mt-2">
                      <p className="text-base md:text-lg font-bold text-white">{album.views.toLocaleString()}</p>
                      <p className="text-[10px] text-zinc-500 truncate">Pelawat album</p>
                    </div>
                  </div>

                  {/* Carian */}
                  <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                      <Search className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Carian
                    </p>
                    <div className="mt-2">
                      <p className="text-base md:text-lg font-bold text-white">{totalSearchesAlbum.toLocaleString()}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                        Bib: <span className="text-white font-medium">{album.bibSearches}</span> | Selfie: <span className="text-white font-medium">{album.selfieSearches}</span>
                      </p>
                    </div>
                  </div>

                  {/* Terjual */}
                  <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                      <ShoppingBag className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Terjual
                    </p>
                    <div className="mt-2">
                      <p className="text-base md:text-lg font-bold text-white">{album.photosSold} <span className="text-xs text-zinc-500 font-normal">unit</span></p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {((album.photosSold / album.totalPhotos) * 100).toFixed(1)}% drpd album
                      </p>
                    </div>
                  </div>

                  {/* Gross Sales */}
                  <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                    <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Gross Sales
                    </p>
                    <div className="mt-2">
                      <p className="text-base md:text-lg font-bold text-white">RM {grossSales.toFixed(2)}</p>
                      <p className="text-[10px] text-zinc-500 truncate">Jualan kasar</p>
                    </div>
                  </div>

                  {/* Nett Sales */}
                  <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/25 flex flex-col justify-between col-span-2 sm:col-span-1">
                    <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                      <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Nett Sales
                    </p>
                    <div className="mt-2">
                      <p className="text-base md:text-lg font-bold text-amber-500">RM {nettSales.toFixed(2)}</p>
                      <p className="text-[10px] text-amber-400/70 truncate">Selepas komisen 10%</p>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}