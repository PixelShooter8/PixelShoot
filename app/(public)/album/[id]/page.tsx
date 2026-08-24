'use client';

import { useState, useEffect, use, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Tag,
  Eye,
  X
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
  pricing_bundles?: PackageTier[]; // <-- Tambah baris ini di sini
  packages?: PackageTier[];
  bundle_options?: PackageTier[];
  pricing_tiers?: PackageTier[];
}

interface PhotoItem {
  id: string;
  bib: string;
  price: number;
  url: string;
  original_url?: string;
}

interface WatermarkSettings {
  watermarkType: string;
  watermarkText: string;
  watermarkLogoUrl: string | null;
  watermarkOpacity: number;
  watermarkSize: number;
  watermarkPattern: string;
}

function GalleryContent({ albumId }: { albumId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bibFromUrl = searchParams.get('bib') || '';
  
  const [searchBib, setSearchBib] = useState<string>(bibFromUrl);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [album, setAlbum] = useState<AlbumDetails | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // State untuk tetapan watermark dari panel admin (admin_settings -> site_settings)
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkSettings>({
    watermarkType: 'text',
    watermarkText: 'PIXELSHOOT',
    watermarkLogoUrl: null,
    watermarkOpacity: 50,
    watermarkSize: 30,
    watermarkPattern: 'Tile + Center'
  });

  // State untuk modal zum / view gambar besar
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  useEffect(() => {
    if (bibFromUrl) {
      setSearchBib(bibFromUrl);
    }
  }, [bibFromUrl]);

  useEffect(() => {
    async function fetchAlbumAndPhotos() {
      if (!albumId) return;
      try {
        // 1. Ambil tetapan watermark sebenar dari jadual admin_settings
        const { data: settingsData } = await supabase
          .from('admin_settings')
          .select('value')
          .eq('key', 'site_settings')
          .single();

        if (settingsData && settingsData.value) {
          const s = settingsData.value as any;
          setWatermarkConfig({
            watermarkType: s.watermarkType ?? 'text',
            watermarkText: s.watermarkText ?? 'PIXELSHOOT',
            watermarkLogoUrl: s.watermarkLogoUrl ?? null,
            watermarkOpacity: s.watermarkOpacity ?? 50,
            watermarkSize: s.watermarkSize ?? 30,
            watermarkPattern: s.watermarkPattern ?? 'Tile + Center'
          });
        }

        // 2. Ambil butiran album
        const { data: albumData } = await supabase
          .from('events')
          .select('*')
          .eq('id', albumId)
          .single();

        let currentAlbumPrice = 20; // Default fallback
        if (albumData) {
          setAlbum(albumData);
          currentAlbumPrice = albumData.price ?? 20;
        }

        // 3. Ambil senarai foto
        const { data: photoData } = await supabase
          .from('photos')
          .select('*')
          .eq('event_id', albumId)
          .order('created_at', { ascending: false });

        if (photoData && photoData.length > 0) {
          const formattedPhotos: PhotoItem[] = photoData.map((p: any) => {
            const finalUrl = p.watermark_url || p.original_url || p.image_url || p.url || '';
            const originalFullUrl = p.original_url || p.watermark_url || finalUrl;

            let bibValue = '0000';
            if (p.bib_numbers && Array.isArray(p.bib_numbers) && p.bib_numbers.length > 0) {
              bibValue = p.bib_numbers.join(', ');
            } else if (p.bib_number) {
              bibValue = String(p.bib_number);
            } else if (p.bib) {
              bibValue = String(p.bib);
            }

            const photoPrice = (p.price && p.price > 10) ? p.price : currentAlbumPrice;

            return {
              id: p.id,
              bib: bibValue,
              price: photoPrice,
              url: finalUrl,
              original_url: originalFullUrl
            };
          });

          setPhotos(formattedPhotos);
        } else {
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

 // Menukar format data pricing_bundles dari Supabase (yang guna 'qty') kepada 'quantity'
  const rawBundles = album?.pricing_bundles || album?.packages || album?.bundle_options || album?.pricing_tiers;
  
  const packagesList: PackageTier[] = Array.isArray(rawBundles) && rawBundles.length > 0
    ? rawBundles.map((b: any) => ({
        quantity: Number(b.quantity ?? b.qty ?? 1),
        price: Number(b.price ?? 0)
      }))
    : [
        { quantity: 1, price: album?.price ?? 16 },
        { quantity: 3, price: 40 },
        { quantity: 5, price: 65 }
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
    const singleUnitPrice = album?.price ?? 20;
    calculatedSum += remainingCount * singleUnitPrice;
    totalPrice = totalSelectedCount > 0 ? calculatedSum : 0;
  }

  const handleCheckout = () => {
    const selectedItems = photos.filter(p => selectedPhotos.includes(p.id));
    const photosParam = encodeURIComponent(JSON.stringify(selectedItems));
    window.location.href = `/checkout?album=${albumId}&total=${totalPrice}&photos=${photosParam}`;
  };

  // Fungsi render watermark dinamik sepenuhnya mengikut tetapan panel admin (opacity selari)
  const renderWatermarkOverlay = (isModal = false) => {
    const { watermarkType, watermarkText, watermarkLogoUrl, watermarkOpacity, watermarkSize, watermarkPattern } = watermarkConfig;
    
    // Guna nilai telus (opacity) terus daripada tetapan admin (dihadkan minimum 0.2 supaya tidak hilang langsung)
    const opacityVal = Math.max(0.2, watermarkOpacity / 100);

    return (
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden flex items-center justify-center z-10">
        {/* Corak TILE (Berulang) */}
        {(watermarkPattern === 'Tile + Center' || watermarkPattern === 'Tile Only') && (
          <div 
            style={{ opacity: Math.min(1, opacityVal * 1.1) }}
            className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-2 gap-2 items-center justify-items-center"
          >
            {[...Array(9)].map((_, i) => (
              <div key={i} className="flex items-center justify-center -rotate-12 w-full h-full overflow-hidden">
                {watermarkType === 'text' ? (
                  <span 
                    style={{ fontSize: `${Math.max(10, watermarkSize * (isModal ? 0.9 : 0.4))}px` }}
                    className="font-black text-white tracking-widest uppercase text-center leading-none drop-shadow-lg"
                  >
                    {watermarkText || 'PIXELSHOOT'}
                  </span>
                ) : (
                  watermarkLogoUrl && (
                    <img
                      src={watermarkLogoUrl}
                      alt="Watermark Tile"
                      style={{ 
                        width: `${Math.max(20, watermarkSize * (isModal ? 1.8 : 0.9))}px`,
                        maxHeight: `${Math.max(20, watermarkSize * (isModal ? 1.8 : 0.9))}px`
                      }}
                      className="object-contain filter brightness-250 drop-shadow-lg"
                    />
                  )
                )}
              </div>
            ))}
          </div>
        )}

        {/* Corak CENTER (Tengah) */}
        {(watermarkPattern === 'Tile + Center' || watermarkPattern === 'Center Only') && (
          <div className="relative z-20 flex items-center justify-center">
            {watermarkType === 'text' ? (
              <span 
                style={{ 
                  opacity: opacityVal,
                  fontSize: `${Math.max(16, watermarkSize * (isModal ? 2.8 : 0.9))}px`
                }}
                className="text-white font-black tracking-widest uppercase text-center px-4 drop-shadow-2xl"
              >
                {watermarkText || 'PIXELSHOOT'}
              </span>
            ) : (
              watermarkLogoUrl && (
                <img
                  src={watermarkLogoUrl}
                  alt="Watermark Center"
                  style={{ 
                    opacity: opacityVal,
                    width: `${Math.max(50, watermarkSize * (isModal ? 6.5 : 2.8))}px`
                  }}
                  className="object-contain max-h-48 filter drop-shadow-2xl"
                />
              )
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-500 transition cursor-pointer bg-transparent border-none"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Albums</span>
          </button>

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
              {album ? album.title : 'Loading Album...'}
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
                  className={`group relative rounded-2xl overflow-hidden border transition-all bg-zinc-900 ${
                    isSelected ? 'border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]' : 'border-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-zinc-900 overflow-hidden select-none flex items-center justify-center">
                    <img 
                      src={photo.url} 
                      alt={`BIB ${photo.bib}`} 
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => toggleSelectPhoto(photo.id)} 
                    />
                    
                    {/* WATERMARK ADMIN SEBENAR DI ATAS KAD GAMBAR */}
                    {renderWatermarkOverlay(false)}

                    {/* BUTANG ZOOM / VIEW GAMBAR BESAR */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(photo.original_url || photo.url);
                      }}
                      className="absolute bottom-14 right-3 bg-black/80 hover:bg-black text-white p-2.5 rounded-full transition opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center shadow-lg border border-amber-500/50 z-20 cursor-pointer"
                      title="Zoom / View Image"
                    >
                      <Eye className="w-4 h-4 text-amber-400" />
                    </button>
                    
                    <div 
                      onClick={() => toggleSelectPhoto(photo.id)}
                      className={`absolute top-3 right-3 w-7 h-7 rounded-lg flex items-center justify-center transition cursor-pointer z-20 ${
                        isSelected ? 'bg-amber-500 text-black' : 'bg-black/60 border border-white/20 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-amber-500 border border-zinc-800 pointer-events-none z-10">
                      BIB #{photo.bib}
                    </span>
                  </div>

                  <div 
                    onClick={() => toggleSelectPhoto(photo.id)}
                    className="p-3 bg-zinc-950 flex items-center justify-between border-t border-zinc-950 cursor-pointer"
                  >
                    <span className="text-xs font-extrabold text-amber-400">RM {Number(photo.price).toFixed(2)}</span>
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

      {/* MODAL LIGHTBOX / ZOOM GAMBAR BESAR DENGAN WATERMARK ADMIN */}
      {zoomedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-8/10 max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setZoomedImage(null)}
              className="absolute -top-12 right-0 text-white bg-zinc-800 hover:bg-zinc-700 p-2.5 rounded-full transition flex items-center justify-center shadow cursor-pointer z-50"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative max-w-full max-h-[85vh] overflow-hidden rounded-xl shadow-2xl border border-zinc-800 bg-zinc-950 flex items-center justify-center">
              <img
                src={zoomedImage}
                alt="Zoomed Preview with Watermark"
                className="max-w-full max-h-[80vh] object-contain select-none pointer-events-none"
              />
              {/* WATERMARK ADMIN TURUT DIPAPARKAN DENGAN JELAS PADA MODAL ZUM */}
              {renderWatermarkOverlay(true)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlbumGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const albumId = resolvedParams?.id ?? '';

  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Gallery...</div>}>
      <GalleryContent albumId={albumId} />
    </Suspense>
  );
}