'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, CreditCard } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const albumId = searchParams.get('album') || 'unknown';
  const total = searchParams.get('total') || '0';
  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    // Mengambil data yang disimpan dari page sebelumnya
    const savedPhotos = sessionStorage.getItem('checkout_photos');
    if (savedPhotos) {
      setPhotos(JSON.parse(savedPhotos));
    }
  }, []);

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
          <div className="flex justify-between">
            <span className="text-zinc-500">Selected Photos:</span>
            <span className="font-bold text-white">{photos.length} photos</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Event ID:</span>
            <span className="font-bold text-white uppercase">{albumId}</span>
          </div>
          <div className="flex justify-between text-base pt-4 border-t border-zinc-900 border-dashed">
            <span className="text-zinc-400 font-bold">Total Payable:</span>
            <span className="font-black text-amber-500 text-lg">RM {total}.00</span>
          </div>
        </div>

        <button 
          onClick={() => alert('Redirecting to payment gateway...')} 
          className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-4 rounded-xl text-sm transition flex items-center justify-center gap-2"
        >
          <CreditCard size={18} />
          Complete Purchase (RM {total}.00)
        </button>
      </main>
    </div>
  );
}

// Wrapper ini yang wajib ada untuk elakkan error Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-xs">
        Loading payment details...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}