'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function SalesReportPage() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbumsAndSales();

    // TAMBAHAN FUNGSI AUTO SUPABASE: Real-time listener untuk auto-sync perubahan data album & jualan
    const albumsChannel = supabase
      .channel('public:albums')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'albums' },
        (payload) => {
          console.log('Realtime change detected in albums:', payload);
          fetchAlbumsAndSales(); // Auto-refresh data apabila terdapat perubahan
        }
      )
      .subscribe();

    // Cleanup subscription apabila komponen ditutup
    return () => {
      supabase.removeChannel(albumsChannel);
    };
  }, []);

  async function fetchAlbumsAndSales() {
    setLoading(true);
    // Mengambil data dari table 'albums'. (Pastikan kolum berkaitan wujud di Supabase anda)
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ralat mengambil data sales report:', error);
    } else {
      setAlbums(data || []);
    }
    setLoading(false);
  }

  // Overall Totals
  const totalViews = albums.reduce((acc, alb) => acc + (alb.views || 0), 0);
  const totalSearches = albums.reduce((acc, alb) => acc + (alb.bibSearches || 0) + (alb.selfieSearches || 0), 0);
  const totalPhotosSold = albums.reduce((acc, alb) => acc + (alb.photosSold || 0), 0);
  const totalGrossSales = albums.reduce((acc, alb) => acc + ((alb.photosSold || 0) * (alb.pricePerPhoto || 0)), 0);

  // --- EXPORT TO CSV (ALL ALBUMS) ---
  const exportAllToCSV = () => {
    const headers = [
      "Album ID,Album Name,Date,Total Photos,Price Per Photo (RM),Views,Bib Searches,Selfie Searches,Photos Sold,Gross Sales (RM),Platform Fee (%) (RM),Nett Sales (RM)"
    ];

    const rows = albums.map(alb => {
      const price = alb.pricePerPhoto || 0;
      const sold = alb.photosSold || 0;
      const feePercent = alb.platformFeePercent || 10;
      const gross = sold * price;
      const fee = (gross * feePercent) / 100;
      const nett = gross - fee;
      return `"${alb.id}","${alb.title || ''}","${alb.date || ''}",${alb.totalPhotos || 0},${price},${alb.views || 0},${alb.bibSearches || 0},${alb.selfieSearches || 0},${sold},${gross.toFixed(2)},${fee.toFixed(2)},${nett.toFixed(2)}`;
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `PixelShoot_Sales_Report_All_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- EXPORT TO CSV (SINGLE ALBUM) ---
  const exportSingleAlbumToCSV = (album) => {
    const price = album.pricePerPhoto || 0;
    const sold = album.photosSold || 0;
    const feePercent = album.platformFeePercent || 10;
    const gross = sold * price;
    const fee = (gross * feePercent) / 100;
    const nett = gross - fee;

    const csvData = [
      ["Album Sales Report - " + (album.title || 'Untitled')],
      ["Date", album.date || '-'],
      ["Total Photos", album.totalPhotos || 0],
      ["Price / Photo", "RM " + price],
      [""],
      ["Metric", "Value"],
      ["Views (Gallery Views)", album.views || 0],
      ["Bib Searches", album.bibSearches || 0],
      ["Selfie Searches", album.selfieSearches || 0],
      ["Total Photos Sold", sold],
      ["Gross Sales", "RM " + gross.toFixed(2)],
      ["Platform Fee (" + feePercent + "%)", "RM " + fee.toFixed(2)],
      ["Nett Sales", "RM " + nett.toFixed(2)]
    ].map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvData);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Report_${(album.title || 'Album').replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 md:p-8 bg-black min-h-screen text-white space-y-8 max-w-7xl mx-auto">
      
      {/* Header Page + Main Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2 text-white">
            <BarChart3 className="w-6 h-6 text-amber-500 shrink-0" />
            Sales Report & Analytics
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Sales performance, views, and image searches by album (Auto-synced).
          </p>
        </div>

        <button
          onClick={exportAllToCSV}
          className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" /> Export All CSV (Excel)
        </button>
      </div>

      {/* Overall Totals (Top Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Views */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Views</span>
            <Eye className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalViews.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Overall gallery views</p>
          </div>
        </div>

        {/* Total Searches */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Searches</span>
            <Search className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalSearches.toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Using Bib & Selfie</p>
          </div>
        </div>

        {/* Photos Sold */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 md:p-5 flex flex-col justify-between">
          <div className="flex justify-between items-center text-zinc-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Photos Sold</span>
            <ShoppingBag className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-white">{totalPhotosSold}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Units downloaded</p>
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
            <p className="text-[10px] text-zinc-400 mt-0.5">Gross sales amount</p>
          </div>
        </div>

      </div>

      {/* Reports by Album Section */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Reports by Album
        </h2>

        {loading ? (
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-500 text-sm">
            Sedang memuatkan laporan jualan...
          </div>
        ) : albums.length === 0 ? (
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-12 text-center text-zinc-500 text-sm">
            No sales reports found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {albums.map((album) => {
              const price = album.pricePerPhoto || 0;
              const sold = album.photosSold || 0;
              const feePercent = album.platformFeePercent || 10;
              const grossSales = sold * price;
              const platformFee = (grossSales * feePercent) / 100;
              const nettSales = grossSales - platformFee;
              const totalSearchesAlbum = (album.bibSearches || 0) + (album.selfieSearches || 0);
              const totalPhotos = album.totalPhotos || 1; // elak bahagi dengan zero

              return (
                <div 
                  key={album.id}
                  className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 md:p-6 hover:border-zinc-700 transition space-y-6"
                >
                  {/* Album Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800/60 pb-4">
                    <div className="flex items-center gap-3.5 overflow-hidden">
                      <div className="bg-amber-500/10 text-amber-500 p-2.5 md:p-3 rounded-xl border border-amber-500/20 shrink-0">
                        <Folder className="w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="overflow-hidden">
                        <h3 className="text-base md:text-lg font-bold text-white truncate">{album.title || 'Untitled Album'}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 mt-1">
                          <span className="flex items-center gap-1 shrink-0">
                            <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {album.date || '-'}
                          </span>
                          <span className="flex items-center gap-1 shrink-0">
                            <ImageIcon className="w-3.5 h-3.5 text-zinc-500" /> {album.totalPhotos || 0} photos
                          </span>
                          <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-medium shrink-0">
                            RM {price}/photo
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Single Album Export Button */}
                    <button
                      onClick={() => exportSingleAlbumToCSV(album)}
                      className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-2 transition shrink-0 self-start sm:self-auto"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-500" /> Export Album CSV
                    </button>
                  </div>

                  {/* Album Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                    
                    {/* Views */}
                    <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                        <Eye className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Views
                      </p>
                      <div className="mt-2">
                        <p className="text-base md:text-lg font-bold text-white">{(album.views || 0).toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-500 truncate">Album visitors</p>
                      </div>
                    </div>

                    {/* Searches */}
                    <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                        <Search className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Searches
                      </p>
                      <div className="mt-2">
                        <p className="text-base md:text-lg font-bold text-white">{totalSearchesAlbum.toLocaleString()}</p>
                        <p className="text-[10px] text-zinc-400 truncate mt-0.5">
                          Bib: <span className="text-white font-medium">{album.bibSearches || 0}</span> | Selfie: <span className="text-white font-medium">{album.selfieSearches || 0}</span>
                        </p>
                      </div>
                    </div>

                    {/* Sold */}
                    <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-800/80 flex flex-col justify-between">
                      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                        <ShoppingBag className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Sold
                      </p>
                      <div className="mt-2">
                        <p className="text-base md:text-lg font-bold text-white">{sold} <span className="text-xs text-zinc-500 font-normal">units</span></p>
                        <p className="text-[10px] text-zinc-500 truncate">
                          {((sold / totalPhotos) * 100).toFixed(1)}% of album
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
                        <p className="text-[10px] text-zinc-500 truncate">Gross revenue</p>
                      </div>
                    </div>

                    {/* Nett Sales */}
                    <div className="bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/25 flex flex-col justify-between col-span-2 sm:col-span-1">
                      <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5 truncate">
                        <DollarSign className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Nett Sales
                      </p>
                      <div className="mt-2">
                        <p className="text-base md:text-lg font-bold text-amber-500">RM {nettSales.toFixed(2)}</p>
                        <p className="text-[10px] text-amber-400/70 truncate">After {feePercent}% commission</p>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}