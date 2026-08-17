'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminUploadPage() {
  // State untuk input form
  const [eventId, setEventId] = useState('maraton-kuching-2026');
  const [price, setPrice] = useState('15.00');
  const [file, setFile] = useState<File | null>(null);

  // State untuk status proses
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Sila pilih sekurang-kurangnya satu fail gambar.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('eventId', eventId);
    formData.append('price', price);

    try {
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal memuat naik gambar.');
      }

      setResult(data);
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Berlaku ralat semasa muat naik.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 my-10 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Upload className="w-6 h-6 text-blue-600" /> Admin Photo Uploader
      </h1>

      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Event / Slug
          </label>
          <input
            type="text"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white outline-none"
            placeholder="maraton-kuching-2026"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Harga Gambar (RM)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Gambar Acara (HD)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Memproses AI & Uploading...
            </>
          ) : (
            'Muat Naik Gambar'
          )}
        </button>
      </form>

      {/* Paparan Keputusan Upload */}
      {result && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-5 h-5 text-green-600" /> Gambar Berjaya Dimuat Naik & Diproses!
          </div>
          <p className="text-sm">
            Nombor BIB Dikesan AI: <strong>{result.detectedBibs?.length > 0 ? result.detectedBibs.join(', ') : 'Tiada (perlu carian selfie)'}</strong>
          </p>
          <p className="text-sm">
            Muka Dikesan AI: <strong>{result.facesDetected} muka</strong>
          </p>
        </div>
      )}

      {/* Paparan Error */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}