'use client';

import { useState } from 'react';
import { Search, Camera, Loader2, Image as ImageIcon, Sparkles, Eye, X } from 'lucide-react';

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'bib' | 'selfie'>('bib');
  
  // State Carian BIB
  const [bibNumber, setBibNumber] = useState('');
  
  // State Carian Selfie
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // State Keputusan & Process
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  // State untuk Modal Zoom / Lightbox
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Handle Gambar Selfie Preview
  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelfieFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Submit Carian BIB
  const handleBibSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bibNumber.trim()) return;

    setLoading(true);
    setSearched(true);
    setPhotos([]);

    try {
      const response = await fetch(`/api/search/bib?bib=${encodeURIComponent(bibNumber.trim())}`);
      const data = await response.json();
      if (response.ok) {
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Ralat carian BIB:', err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Carian Selfie AI
  const handleSelfieSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfieFile) return;

    setLoading(true);
    setSearched(true);
    setPhotos([]);

    const formData = new FormData();
    formData.append('file', selfieFile);

    try {
      const response = await fetch('/api/search/face', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setPhotos(data.photos || []);
      }
    } catch (err) {
      console.error('Ralat carian muka:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Cari Gambar Larian Anda
          </h1>
          <p className="mt-2 text-gray-600">
            Gunakan Nombor BIB atau muat naik Selfie untuk carian berasaskan AI.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 flex gap-2">
            <button
              onClick={() => { setActiveTab('bib'); setSearched(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition ${
                activeTab === 'bib'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="w-4 h-4" /> Carian Nombor BIB
            </button>
            <button
              onClick={() => { setActiveTab('selfie'); setSearched(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition ${
                activeTab === 'selfie'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Camera className="w-4 h-4" /> Carian AI Selfie
            </button>
          </div>
        </div>

        {/* Form Carian BIB */}
        {activeTab === 'bib' && (
          <form onSubmit={handleBibSearch} className="max-w-md mx-auto mb-10">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Masukkan Nombor BIB (Cth: 1234)"
                value={bibNumber}
                onChange={(e) => setBibNumber(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-gray-900 bg-white"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Cari'}
              </button>
            </div>
          </form>
        )}

        {/* Form Carian Selfie AI */}
        {activeTab === 'selfie' && (
          <form onSubmit={handleSelfieSearch} className="max-w-md mx-auto mb-10 space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-white hover:border-blue-500 transition">
              {previewUrl ? (
                <div className="space-y-3">
                  <img
                    src={previewUrl}
                    alt="Selfie preview"
                    className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-blue-100 shadow"
                  />
                  <label className="text-sm text-blue-600 font-medium cursor-pointer block hover:underline">
                    Tukar Gambar
                    <input type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer block space-y-2">
                  <Sparkles className="w-10 h-10 text-blue-500 mx-auto" />
                  <span className="text-sm font-medium text-gray-700 block">
                    Muat Naik Gambar Muka / Selfie Anda
                  </span>
                  <span className="text-xs text-gray-400 block">PNG, JPG sehingga 10MB</span>
                  <input type="file" accept="image/*" onChange={handleSelfieChange} className="hidden" />
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !selfieFile}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Mencari Muka Dengan AI...
                </>
              ) : (
                'Cari Gambar Saya'
              )}
            </button>
          </form>
        )}

        {/* Keputusan Gambar */}
        {searched && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Keputusan Carian ({photos.length} Gambar Diperoleh)
            </h2>

            {photos.length === 0 && !loading && (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Tiada gambar dijumpai.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Cuba nombor BIB lain atau gunakan carian AI Selfie.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {photos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                  <div className="relative aspect-[4/3] cursor-pointer" onClick={() => setSelectedImage(photo.original_url || photo.watermark_url)}>
                    <img
                      src={photo.watermark_url}
                      alt="Event Photo"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {/* Butang Zum / View Interaktif */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-medium text-xs">
                      <Eye className="w-5 h-5 text-amber-400" />
                      <span>Zum / Preview</span>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Harga</p>
                      {/* Harga Dinamik Mengikut Database */}
                      <p className="text-lg font-bold text-blue-600">
                        RM {photo.price ? Number(photo.price).toFixed(2) : '20.00'}
                      </p>
                    </div>
                    <button className="bg-gray-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition">
                      Beli Gambar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODAL ZOOM / LIGHTBOX UNTUK PAPAR GAMBAR BESAR */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 bg-zinc-800 p-2 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
              <img 
                src={selectedImage} 
                alt="Zoomed Preview" 
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}