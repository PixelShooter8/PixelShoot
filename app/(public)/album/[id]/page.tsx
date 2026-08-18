'use client';

import { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { 
  ArrowLeft, 
  Search, 
  ShoppingBag, 
  Check, 
  Sparkles,
  Filter,
  Calendar,
  MapPin,
  Tag
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PackageTier {
  quantity: number;
  price: number;
}

interface AlbumDetails {
  id: string;
  title: string;
  event_date?: string;
  location?: string;
  price?: number;
  packages?: PackageTier[];
  bundle_options?: PackageTier[];
  pricing_tiers?: PackageTier[];
}

interface PhotoItem {
  id: string;
  bib: string;
  price: number;
  url: string;
}

function GalleryContent({ albumId }: { albumId: string }) {
  const searchParams = useSearchParams();
  const bibFromUrl = searchParams.get('bib') || '';
  
  const [searchBib, setSearchBib] = useState(bibFromUrl);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [album, setAlbum] = useState<AlbumDetails | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (bibFromUrl) {
      setSearchBib(bibFromUrl);
    }
  }, [bibFromUrl]);

  useEffect(() => {
    async function fetchAlbumAndPhotos() {
      try {
        // 1. Ambil maklumat event/album
        const { data: albumData, error: albumError } = await supabase
          .from('events')
          .select('*')
          .eq('id', albumId)
          .single();

        if (albumData) {
          setAlbum(albumData);
        }

        const singlePhotoPrice = albumData?.price ?? 16;

        // 2. Ambil gambar berdasarkan event_id
        const { data: photoData, error: photoError } = await supabase
          .from('photos')
          .select('*')
          .eq('event_id', albumId)
          .order('created_at', { ascending: false });

        if (photoData && photoData.length > 0) {
          const publicDomain = 'https://pub-8943b59650804e5696356dcaa834ac4d.r2.dev';

          const formattedPhotos = photoData.map((p: any) => {
            // Ambil URL mentah daripada mana-mana kolum yang ada
            const rawUrl = p.watermark_url || p.image_url || p.url || p.original_url || '';
            
            // Ekstrak nama fail di hujung URL dan gabungkan dengan publicDomain R2 yang sah
            let finalUrl = rawUrl;
            if (rawUrl) {
              const fileName = rawUrl.split('/').pop();
              finalUrl = `${publicDomain}/${fileName}`;
            }

            return {
              id: p.id,
              bib: p.bib_number || p.bib || '0000',
              price: p.price ?? singlePhotoPrice,
              url: finalUrl
            };
          });

          setPhotos(formattedPhotos);
        } else {
          // Jika tiada gambar dijumpai untuk event_id ini, set kosong supaya tidak memaparkan data palsu
          setPhotos([]);
        }
      } catch (err) {
        console.error('Error loading gallery:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumAndPhotos();
  }, [albumId]);

  const filteredPhotos = searchBib 
    ? photos.filter(p => p.bib.toLowerCase().includes(searchBib.trim().toLowerCase()))
    : photos;

  const toggleSelectPhoto = (id: string) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter(item => item !== id));
    } else {
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  const packagesList: PackageTier[] = album?.packages || album?.bundle_options || album?.pricing_tiers || [
    { quantity: 1, price: album?.price ?? 16 },
    { quantity: 3, price: 40 },
    { quantity: 5, price: 85 }
  ];

  const totalSelectedCount = selectedPhotos.length;
  let totalPrice = 0;

  const matchedPackage = packagesList.find(pkg => Number(pkg.quantity) === totalSelectedCount);

  if (matchedPackage) {
    totalPrice = Number(matchedPackage.price);
  } else {
    const sortedPackages = [...packagesList].sort((a, b) => Number(b.quantity) - Number(a.quantity));
    let remainingCount = totalSelectedCount;
    let calculatedSum = 0;

    for (const pkg of sortedPackages) {
      const q = Number(pkg.quantity);
      if (q > 1 && remainingCount >= q) {
        const multiplier = Math.floor(remainingCount / q);
        calculatedSum += multiplier * Number(pkg.price);
        remainingCount %= q;
      }
    }
    const singleUnitPrice = album?.price ?? 16;
    calculatedSum += remainingCount * singleUnitPrice;
    totalPrice = totalSelectedCount > 0 ? calculatedSum : 0;
  }

  const handleCheckout = () => {
    const selectedItems = photos.filter(p => selectedPhotos.includes(p.id));
    const photosParam = encodeURIComponent(JSON.stringify(selectedItems));
    window.location.href = `/checkout?album=${albumId}&total=${totalPrice}&photos=${photosParam}`;
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-500 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-zinc-500 uppercase font-semibold">Selected ({selectedPhotos.length})</p>
              <p className="text-sm font-extrabold text-amber-500">RM {totalPrice}.00</p>
            </div>
            <button 
              disabled={selectedPhotos.length === 0}
              onClick={handleCheckout}
              className="bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-black font-extrabold px-5 py-2.5 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-zinc-900">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 text-[11px] font-bold border border-amber-500/20">
              <Sparkles className="w-3 h-3" /> Event Gallery ({photos.length} Photos)
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-wide">
              {album ? album.title : albumId.replace(/-/g, ' ')}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400 pt-1">
              {album?.event_date && <span className="flex items-center gap-1.5 mr-2"><Calendar className="w-3.5 h-3.5" /> {album.event_date}</span>}
              {album?.location && <span className="flex items-center gap-1.5 mr-2"><MapPin className="w-3.5 h-3.5" /> {album.location}</span>}
              {packagesList.map((pkg, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold">
                  <Tag className="w-3 h-3" /> {pkg.quantity} Photo{Number(pkg.quantity) > 1 ? 's' : ''}: RM {pkg.price}.00
                </span>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Filter by BIB Number..."
              value={searchBib}
              onChange={(e) => setSearchBib(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-zinc-500 text-sm">Loading gallery photos...</div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-900">
            <Filter className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm font-semibold text-zinc-400">
              {photos.length === 0 ? "No photos uploaded in this album yet." : `No photos found for BIB "${searchBib}"`}
            </p>
            {photos.length > 0 && (
              <button onClick={() => setSearchBib('')} className="mt-4 text-xs text-amber-500 underline font-semibold">Clear filter</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => {
              const isSelected = selectedPhotos.includes(photo.id);
              return (
                <div 
                  key={photo.id} 
                  onClick={() => toggleSelectPhoto(photo.id)} 
                  className={`group relative rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]' : 'border-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden select-none flex items-center justify-center">
                    <img src={photo.url} alt={`BIB ${photo.bib}`} className="w-full h-full object-cover pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity">
                      <p className="text-white/40 text-xl font-black uppercase tracking-widest -rotate-45">WATERMARK</p>
                    </div>
                    
                    <div className={`absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition ${
                      isSelected ? 'bg-amber-500 text-black' : 'bg-black/60 border border-white/20 text-transparent'
                    }`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-500 border border-zinc-800">
                      BIB #{photo.bib}
                    </span>
                  </div>

                  <div className="p-3 bg-zinc-950 flex items-center justify-between border-t border-zinc-900">
                    <span className="text-xs font-extrabold text-white">RM {photo.price}.00</span>
                    <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-amber-500' : 'text-zinc-500'}`}>
                      {isSelected ? 'Selected' : '+ Click to Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default function AlbumGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const albumId = resolvedParams?.id || 'maraton-kuching-2026';

  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Gallery...</div>}>
      <GalleryContent albumId={albumId} />
    </Suspense>
  );
}