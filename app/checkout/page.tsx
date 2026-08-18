'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CreditCard } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PhotoItem {
  id: string;
  bib: string;
  url: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get('album') || '';
  const total = searchParams.get('total') || '0';
  const photosParam = searchParams.get('photos');
  
  const [albumTitle, setAlbumTitle] = useState<string>(albumId.replace(/-/g, ' '));
  const [selectedPhotoItems, setSelectedPhotoItems] = useState<PhotoItem[]>([]);

  useEffect(() => {
    async function fetchAlbumTitle() {
      if (albumId) {
        const { data: albumData } = await supabase
          .from('events')
          .select('title')
          .eq('id', albumId)
          .single();
        
        if (albumData?.title) {
          setAlbumTitle(albumData.title);
        }
      }
    }

    fetchAlbumTitle();

    // Baca data gambar terus dari URL parameter tanpa perlu query database lagi
    if (photosParam) {
      try {
        const parsedPhotos: PhotoItem[] = JSON.parse(decodeURIComponent(photosParam));
        if (parsedPhotos && parsedPhotos.length > 0) {
          setSelectedPhotoItems(parsedPhotos);
        }
      } catch (e) {
        console.error('Error parsing photos from URL:', e);
      }
    }
  }, [albumId, photosParam]);

 const handleStripeCheckout = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total, albumId }),
      });

      const data = await response.json();
      
      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        // Paparkan ralat sebenar daripada backend
        alert('Ralat: ' + (data.error || 'Gagal memproses pembayaran'));
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert('Gagal menyambung ke pelayan: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 sm:p-10">
      <header className="max-w-2xl mx-auto mb-8">
        <Link href={`/album/${albumId}`} className="text-zinc-400 hover:text-amber-500 flex items-center gap-2 text-xs font-semibold transition">
          <ArrowLeft size={16} /> Back to Gallery
        </Link>
      </header>

      <main className="max-w-2xl mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="text-amber-500 w-8 h-8" />
          <h1 className="text-2xl font-black uppercase">Order Summary</h1>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-zinc-300 border-y border-zinc-900 py-6 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Event / Album:</span>
            <span className="font-bold text-white uppercase text-right">{albumTitle}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Selected Photos:</span>
            <span className="font-bold text-white">{selectedPhotoItems.length} photos</span>
          </div>

          {/* Preview Gambar Saiz Kecil (Thumbnail) */}
          {selectedPhotoItems.length > 0 && (
            <div className="pt-2">
              <p className="text-[11px] text-zinc-500 uppercase font-semibold mb-2">Photo Previews:</p>
              <div className="flex flex-wrap gap-2">
                {selectedPhotoItems.map((photo, idx) => (
                  <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-zinc-800 bg-zinc-900">
                    <img src={photo.url} alt={`BIB ${photo.bib}`} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-amber-400 font-bold text-center">
                      #{photo.bib}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between text-base pt-4 border-t border-zinc-900 border-dashed">
            <span className="text-zinc-400 font-bold">Total Payable:</span>
            <span className="font-black text-amber-500 text-lg">RM {total}.00</span>
          </div>
        </div>

        <button 
          onClick={handleStripeCheckout} 
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-4 rounded-xl text-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <CreditCard size={18} />
          Complete Purchase (RM {total}.00)
        </button>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-xs">
        Loading checkout summary...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}