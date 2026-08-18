'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Gallery({ eventId }: { eventId?: string }) {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchImages() {
      let query = supabase.from('photos').select('*').order('created_at', { ascending: false });
      
      // Jika ada eventId, tapis mengikut event tersebut
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {images.map((photo) => (
        <div key={photo.id} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
          <img 
            src={photo.watermark_url || photo.original_url} 
            alt="Event Photo" 
            className="w-full h-auto object-cover" 
          />
        </div>
      ))}
    </div>
  );
}