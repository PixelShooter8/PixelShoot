'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Gallery() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function fetchImages() {
      // Dapatkan senarai fail dari bucket photo-preview
      const { data, error } = await supabase.storage
        .from('photo-preview')
        .list('', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } });

      if (data) {
        const publicUrls = data.map((file) => 
          supabase.storage.from('photo-preview').getPublicUrl(file.name).data.publicUrl
        );
        setImages(publicUrls);
      }
    }
    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {images.map((url, index) => (
        <div key={index} className="border border-slate-700 rounded-lg overflow-hidden">
          <img src={url} alt="Watermarked" className="w-full h-auto" />
        </div>
      ))}
    </div>
  );
}