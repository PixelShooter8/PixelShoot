'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Gallery({ eventId }: { eventId?: string }) {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchImages() {
      let query = supabase.from('photos').select('*').order('created_at', { ascending: false });
      
      if (eventId) {
        query = query.eq('event_id', eventId);
      }

      const { data, error } = await query;

      if (data) {
        setImages(data);
      }
    }
    fetchImages();
  }, [eventId]);

  return (
    <div>
      <p className="text-sm text-gray-400 mb-4">Total Photos: {images.length}</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((photo) => {
          // Pastikan kita guna watermark_url, jika tiada guna original_url
          let imageUrl = photo.watermark_url || photo.original_url;

          return (
            <div key={photo.id} className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900 shadow-lg">
              <div className="relative aspect-[4/3] bg-slate-800 flex items-center justify-center">
                <img 
                  src={imageUrl} 
                  alt="Event Photo" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Gagal paparkan imej:", imageUrl);
                  }}
                />
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-900/90">
                <span className="text-xs text-amber-400 font-semibold">
                  {photo.bib_numbers && photo.bib_numbers.length > 0 ? `BIB #${photo.bib_numbers.join(', ')}` : 'BIB 0000'}
                </span>
                <span className="text-sm font-bold text-white">RM {photo.price || '15.00'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}