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

// Komponen Content yang menggunakan useSearchParams
function GalleryContent({ albumId }: { albumId: string }) {
  const searchParams = useSearchParams();
  const bibFromUrl = searchParams.get('bib') || '';
  
  const [searchBib, setSearchBib] = useState(bibFromUrl);
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [album, setAlbum] = useState<AlbumDetails | null>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (bibFromUrl) setSearchBib(bibFromUrl);
  }, [bibFromUrl]);

  useEffect(() => {
    async function fetchAlbumAndPhotos() {
      try {
        const { data: albumData } = await supabase
          .from('events')
          .select('*')
          .eq('id', albumId)
          .single();

        if (albumData) setAlbum(albumData);

        const { data: photoData } = await supabase
          .from('photos')
          .select('*')
          .eq('event_id', albumId);

        const singlePhotoPrice = albumData?.price ?? 16;

        if (photoData && photoData.length > 0) {
          setPhotos(photoData.map((p: any) => ({
            id: p.id,
            bib: p.bib_number || p.bib || '0000',
            price: p.price ?? singlePhotoPrice,
            url: p.image_url || p.url || ''
          })));
        } else {
          setPhotos([
            { id: 'p1', bib: '8821', price: singlePhotoPrice, url: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=800' },
            { id: 'p2', bib: '8821', price: singlePhotoPrice, url: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=800' },
            { id: 'p3', bib: '4102', price: singlePhotoPrice, url: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=800' },
            { id: 'p4', bib: '8821', price: singlePhotoPrice, url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800' },
          ]);
        }
      } catch (err) {
        console.error('Error loading:', err);
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
    setSelectedPhotos(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const packagesList: PackageTier[] = album?.packages || album?.bundle_options || album?.pricing_tiers || [
    { quantity: 1, price: album?.price ?? 16 },
    { quantity: 3, price: 40 },
    { quantity: 5, price: 85 }
  ];

  const totalSelectedCount = selectedPhotos.length;
  const matchedPackage = packagesList.find(pkg => Number(pkg.quantity) === totalSelectedCount);
  let totalPrice = matchedPackage ? Number(matchedPackage.price) : 0;

  if (!matchedPackage && totalSelectedCount > 0) {
    const sortedPackages = [...packagesList].sort((a, b) => Number(b.quantity) - Number(a.quantity));
    let remaining = totalSelectedCount;
    let sum = 0;
    for (const pkg of sortedPackages) {
      if (pkg.quantity > 1 && remaining >= pkg.quantity) {
        sum += Math.floor(remaining / pkg.quantity) * Number(pkg.price);
        remaining %= pkg.quantity;
      }
    }
    sum += remaining * (album?.price ?? 16);
    totalPrice = sum;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-amber-500 transition">
            <ArrowLeft className="w-4 h-4" /> <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-3">
             <div className="text-right"><p className="text-[10px] text-zinc-500 uppercase">Selected</p><p className="text-sm font-extrabold text-amber-500">RM {totalPrice}.00</p></div>
             <button onClick={() => alert(`Checkout: RM ${totalPrice}`)} className="bg-amber-500 text-black px-5 py-2.5 rounded-xl text-xs font-extrabold">Checkout</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-black uppercase mb-6">{album ? album.title : albumId.replace(/-/g, ' ')}</h1>
        <div className="relative mb-8"><Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" /><input value={searchBib} onChange={(e) => setSearchBib(e.target.value)} className="w-full bg-zinc-900 rounded-xl py-2.5 pl-10 text-xs" placeholder="Filter by BIB..." /></div>
        
        {loading ? <div>Loading...</div> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} onClick={() => toggleSelectPhoto(photo.id)} className={`group relative rounded-2xl overflow-hidden cursor-pointer border ${selectedPhotos.includes(photo.id) ? 'border-amber-500' : 'border-zinc-900'}`}>
                <img src={photo.url} className="w-full aspect-[4/3] object-cover" />
                <div className="p-3 bg-zinc-950 flex justify-between"><span className="text-xs font-extrabold">RM {photo.price}.00</span></div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

// Wrapper utama untuk page
export default function AlbumGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  return (
    <Suspense fallback={<div className="text-white p-20 text-center">Loading Content...</div>}>
      <GalleryContent albumId={id} />
    </Suspense>
  );
}