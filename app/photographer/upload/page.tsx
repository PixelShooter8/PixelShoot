'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface UploadItem {
  id: string
  file: File
  name: string
  size: string
  status: 'success' | 'failed' | 'queue'
  message: string
}

interface AlbumItem {
  id: string;
  title: string;
}

export default function PhotographerUpload() {
  const [albums, setAlbums] = useState<AlbumItem[]>([])
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [activeTab, setActiveTab] = useState<'success' | 'failed' | 'queue'>('queue')
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE_MB = 15
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  useEffect(() => {
    async function fetchAlbums() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .order('created_at', { ascending: false })

      if (!error && data && data.length > 0) {
        setAlbums(data)
        setSelectedAlbum(data[0].id)
      }
    }
    fetchAlbums()
  }, [])

  const handleFiles = (files: FileList | null) => {
    if (!files) return

    const newItems: UploadItem[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      const isFailed = file.size > MAX_FILE_SIZE_BYTES

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file: file,
        name: file.name,
        size: sizeMb,
        status: isFailed ? 'failed' : 'queue',
        message: isFailed ? `Melebihi had ${MAX_FILE_SIZE_MB}MB` : 'Sedia untuk dimuat naik'
      })
    }

    setUploads(prev => [...newItems, ...prev])
    setActiveTab('queue')
  }

  const handleDelete = (id: string) => {
    setUploads(uploads.filter(item => item.id !== id))
  }

  const compressImageForPreview = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          const MAX_HEIGHT = 1200
          let width = img.width
          let height = img.height

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height
              height = MAX_HEIGHT
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Gagal memproses preview'))
            }
          }, 'image/jpeg', 0.7)
        }
        img.onerror = (error) => reject(error)
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const startUploadProcess = async () => {
    const queueItems = uploads.filter(item => item.status === 'queue')
    if (queueItems.length === 0) {
      alert('Tiada fail dalam baris gilir.')
      return
    }

    if (!selectedAlbum) {
      alert('Sila pilih album sasaran terlebih dahulu.')
      return
    }

    // Ambil sesi terkini untuk pastikan token auth disertakan
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    setIsUploading(true)
    let successCount = 0

    for (const item of queueItems) {
      try {
        const fileExt = item.file.name.split('.').pop()
        const uniqueName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
        
        const originalFilePath = `${selectedAlbum}/${uniqueName}.${fileExt}`
        const previewFilePath = `${selectedAlbum}/${uniqueName}_preview.jpg`

        // Konfigurasi Header Authorization secara manual jika token wujud
        const uploadOptions: { cacheControl?: string; upsert?: boolean; headers?: { authorization: string } } = {
          upsert: false
        }
        if (token) {
          uploadOptions.headers = { authorization: `Bearer ${token}` }
        }

        // 1. Muat naik fail asal ke bucket 'photo-original'
        const { error: originalError } = await supabase.storage
          .from('photo-original')
          .upload(originalFilePath, item.file, uploadOptions)

        if (originalError) throw originalError

        const { data: originalUrlData } = supabase.storage
          .from('photo-original')
          .getPublicUrl(originalFilePath)

        // 2. Jana & muat naik fail ringan ke bucket 'photo-preview'
        const compressedBlob = await compressImageForPreview(item.file)
        const { error: previewError } = await supabase.storage
          .from('photo-preview')
          .upload(previewFilePath, compressedBlob, {
            contentType: 'image/jpeg',
            upsert: true,
            ...(token ? { headers: { authorization: `Bearer ${token}` } } : {})
          })

        if (previewError) throw previewError

        const { data: previewUrlData } = supabase.storage
          .from('photo-preview')
          .getPublicUrl(previewFilePath)

        // 3. Simpan maklumat ke dalam jadual 'photos'
        const { error: dbError } = await supabase
          .from('photos')
          .insert([
            {
              event_id: selectedAlbum,
              original_url: originalUrlData.publicUrl,
              preview_url: previewUrlData.publicUrl,
              watermark_url: previewUrlData.publicUrl, // Diisi untuk mengelakkan ralat NOT NULL
              price: 10.00,
              bib_numbers: []
            }
          ])

        if (dbError) throw dbError

        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: 'success', message: 'Berjaya dimuat naik!' } : u))
        successCount++

      } catch (err: any) {
        console.error('Ralat proses upload:', err)
        setUploads(prev => prev.map(u => u.id === item.id ? { ...u, status: 'failed', message: err.message || 'Gagal' } : u))
      }
    }

    setIsUploading(false)
    setActiveTab('success')
    alert(`Berjaya memuat naik ${successCount} gambar ke album!`)
  }

  const countSuccess = uploads.filter(item => item.status === 'success').length
  const countFailed = uploads.filter(item => item.status === 'failed').length
  const countQueue = uploads.filter(item => item.status === 'queue').length
  const filteredUploads = uploads.filter(item => item.status === activeTab)

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      <Sidebar activeTab="upload" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Upload Event Photos</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>Muat naik dengan token sesi autentikasi bersepadu.</p>
        </div>

        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px', maxWidth: '850px', marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
            Pilih Album Sasaran:
          </label>
          <select 
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            style={{
              width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px',
              padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none', cursor: 'pointer'
            }}
          >
            {albums.length === 0 ? (
              <option value="">Tiada album ditemui</option>
            ) : (
              albums.map((album) => (
                <option key={album.id} value={album.id}>{album.title}</option>
              ))
            )}
          </select>
        </div>

        <div style={{ 
          background: '#121212', border: `2px dashed ${isDragging ? '#facc15' : '#333'}`, 
          borderRadius: '16px', padding: '40px 20px', textAlign: 'center', maxWidth: '850px', cursor: 'pointer', marginBottom: '20px'
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" onChange={(e) => handleFiles(e.target.files)} style={{ display: 'none' }} multiple accept="image/jpeg,image/png" />
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📤</div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px 0' }}>Seret & Lepas gambar anda di sini</h3>
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 15px 0' }}>Sokong JPG, PNG (Sehingga 15MB)</p>
          <button style={{ background: '#facc15', color: '#000', border: 'none', padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            Pilih Fail
          </button>
        </div>

        {countQueue > 0 && (
          <div style={{ maxWidth: '850px', marginBottom: '25px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={startUploadProcess}
              disabled={isUploading}
              style={{
                background: '#4ade80', color: '#000', border: 'none', padding: '12px 28px',
                borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
              }}
            >
              {isUploading ? 'Sedang Memproses & Muat Naik...' : `🚀 Mula Muat Naik (${countQueue} fail)`}
            </button>
          </div>
        )}

        <div style={{ maxWidth: '850px' }}>
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '20px' }}>
            <button onClick={() => setActiveTab('queue')} style={{ background: activeTab === 'queue' ? '#222' : 'transparent', color: activeTab === 'queue' ? '#facc15' : '#888', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Queue ({countQueue})</button>
            <button onClick={() => setActiveTab('success')} style={{ background: activeTab === 'success' ? '#222' : 'transparent', color: activeTab === 'success' ? '#4ade80' : '#888', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Successful ({countSuccess})</button>
            <button onClick={() => setActiveTab('failed')} style={{ background: activeTab === 'failed' ? '#222' : 'transparent', color: activeTab === 'failed' ? '#f87171' : '#888', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Failed ({countFailed})</button>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
            {filteredUploads.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '14px' }}>Tiada fail dalam bahagian ini.</div>
            ) : (
              filteredUploads.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #1a1a1a' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 2px 0', color: '#fff' }}>{item.name}</p>
                    <p style={{ fontSize: '12px', color: item.status === 'failed' ? '#f87171' : '#888', margin: 0 }}>{item.message}</p>
                  </div>
                  <button onClick={() => handleDelete(item.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Padam</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}