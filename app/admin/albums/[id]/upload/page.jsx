'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AlbumUploadPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id;

  const [albumTitle, setAlbumTitle] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchAlbum() {
      const { data } = await supabase
        .from('events')
        .select('title')
        .eq('id', albumId)
        .single();
      if (data) setAlbumTitle(data.title);
    }
    if (albumId) fetchAlbum();
  }, [albumId]);

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ filename: file.name, contentType: file.type, albumId }),
        });
        const data = await res.json();

        if (data.uploadUrl) {
          await fetch(data.uploadUrl, {
            method: 'PUT',
            headers: { 'Content-Type': file.type },
            body: file,
          });

          await supabase.from('photos').insert({
            album_id: albumId,
            file_key: data.fileKey,
            name: file.name,
          });
        }
      }
      alert('All photos uploaded successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error uploading photos.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push('/admin/albums')}
          className="text-gray-400 hover:text-white mb-6 text-sm"
        >
          ← Back to Albums List
        </button>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Upload Photos: {albumTitle || 'Album'}</h1>
          <label className="cursor-pointer bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium text-sm transition">
            {uploading ? 'Uploading...' : '+ Select & Upload Photos'}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="border-2 border-dashed border-gray-800 rounded-2xl p-12 text-center bg-gray-900/50">
          <p className="text-gray-400 mb-2">Drag and drop photo files here, or click the button above.</p>
          <p className="text-xs text-gray-500">Supports image files (JPG, PNG)</p>
        </div>
      </div>
    </div>
  );
}