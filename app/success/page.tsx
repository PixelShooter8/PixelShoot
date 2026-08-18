'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const photosParam = searchParams.get('photos'); // Menjangkakan data foto dihantar dari checkout
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    if (photosParam) {
      try {
        setPhotos(JSON.parse(decodeURIComponent(photosParam)));
      } catch (e) {
        console.error('Gagal memproses data foto');
      }
    }
  }, [photosParam]);

  const handleDownload = async (fileKey: string, fileName: string) => {
    try {
      const res = await fetch(`/api/download?key=${encodeURIComponent(fileKey)}`);
      const data = await res.json();
      if (data.url) {
        // Buka pautan muat turun dalam tab baru atau muat turun terus
        const a = document.createElement('a');
        a.href = data.url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert('Gagal mendapatkan pautan muat turun.');
      }
    } catch (err) {
      console.error(err);
      alert('Ralat semasa memuat turun fail.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-950 text-white">
      <div className="max-w-xl w-full bg-gray-900 p-8 rounded-2xl shadow-xl border border-gray-800">
        <h1 className="text-3xl font-bold text-green-500 mb-2">Pembayaran Berjaya! 🎉</h1>
        <p className="text-gray-400 mb-6">Terima kasih. Foto anda kini bersedia untuk dimuat turun.</p>

        <div className="space-y-4 text-left mb-6">
          <h2 className="text-lg font-semibold border-b border-gray-800 pb-2">Senarai Foto Anda:</h2>
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-800 p-3 rounded-lg">
                <span className="truncate max-w-[200px] text-sm">{photo.name || `Foto #${index + 1}`}</span>
                <button
                  onClick={() => handleDownload(photo.fileKey, photo.name || `photo_${index}.jpg`)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-medium rounded-lg transition"
                >
                  Muat Turun
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Tiada maklumat foto terperinci, tetapi bayaran anda telah diterima.</p>
          )}
        </div>

        <button 
          onClick={() => window.location.href = '/'} 
          className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition"
        >
          Kembali ke Utama
        </button>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Memuatkan...</div>}>
      <SuccessContent />
    </Suspense>
  );
}