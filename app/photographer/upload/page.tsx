'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Sidebar from '@/components/Sidebar'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CURRENT_USER_ID = 'user_A'

interface UploadItem {
  id: string
  file: File
  name: string
  size: string
  status: 'success' | 'failed' | 'queue'
  message: string
  photographerId: string
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

  const MAX_FILE_SIZE_MB = 8
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

  // Ambil senarai album sebenar dari Supabase (Jadual events)
  useEffect(() => {
    async function fetchAlbums() {
      const { data, error } = await supabase
        .from('events')
        .select('id, title')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Ralat memuatkan album:', error)
      } else if (data && data.length > 0) {
        setAlbums(data)
        setSelectedAlbum(data[0].id) // Tetapkan pilihan pertama sebagai default
      } else {
        setAlbums([])
        setSelectedAlbum('')
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
        message: isFailed ? `Exceeds ${MAX_FILE_SIZE_MB}MB limit` : 'Ready to upload',
        photographerId: CURRENT_USER_ID
      })
    }

    setUploads(prev => [...newItems, ...prev])
    setActiveTab('queue')
  }

  const handleDelete = (id: string) => {
    setUploads(uploads.filter(item => item.id !== id))
  }

  const startUploadProcess = () => {
    const queueItems = uploads.filter(item => item.status === 'queue')
    if (queueItems.length === 0) {
      alert('No files in queue to upload.')
      return
    }

    if (!selectedAlbum) {
      alert('Sila pilih album sasaran terlebih dahulu.')
      return
    }

    setIsUploading(true)

    setTimeout(() => {
      setUploads(prev => prev.map(item => {
        if (item.status === 'queue') {
          return { ...item, status: 'success', message: 'Uploaded successfully' }
        }
        return item
      }))
      setIsUploading(false)
      setActiveTab('success')
      alert(`Successfully uploaded photos to selected album!`)
    }, 1500)
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
          <p style={{ color: '#888', fontSize: '14px' }}>Upload participant photos (Max 8MB per file) to the selected event album.</p>
        </div>

        {/* Pilihan Album Dinamik dari Supabase */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px', maxWidth: '850px', marginBottom: '25px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>
            Select Target Event Album:
          </label>
          <select 
            value={selectedAlbum}
            onChange={(e) => setSelectedAlbum(e.target.value)}
            style={{
              width: '100%',
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '8px',
              padding: '12px 16px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {albums.length === 0 ? (
              <option value="">Tiada album aktif ditemui (Sila buat album di Admin)</option>
            ) : (
              albums.map((album) => (
                <option key={album.id} value={album.id}>
                  {album.title}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Kotak Drag & Drop */}
        <div style={{ 
          background: '#121212', 
          border: `2px dashed ${isDragging ? '#facc15' : '#333'}`, 
          borderRadius: '16px', 
          padding: '40px 20px', 
          textAlign: 'center',
          maxWidth: '850px',
          cursor: 'pointer',
          marginBottom: '20px',
          transition: 'all 0.2s ease'
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: 'none' }}
            multiple
            accept="image/jpeg,image/png"
          />
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📤</div>
          <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px 0' }}>Drag & Drop your photos here</h3>
          <p style={{ color: '#888', fontSize: '13px', margin: '0 0 15px 0' }}>Max file size: 8MB. (Supports JPG, PNG)</p>
          
          <button style={{
            background: '#facc15',
            color: '#000',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '6px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer'
          }}>
            Browse Files
          </button>
        </div>

        {countQueue > 0 && (
          <div style={{ maxWidth: '850px', marginBottom: '25px', display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={startUploadProcess}
              disabled={isUploading}
              style={{
                background: '#4ade80',
                color: '#000',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(74, 222, 128, 0.3)',
                transition: 'opacity 0.2s'
              }}
            >
              {isUploading ? 'Uploading to Album...' : `🚀 Start Upload (${countQueue} files)`}
            </button>
          </div>
        )}

        {/* Panel Status (Tabs) */}
        <div style={{ maxWidth: '850px' }}>
          <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #222', paddingBottom: '15px', marginBottom: '20px' }}>
            
            <button
              onClick={() => setActiveTab('queue')}
              style={{
                background: activeTab === 'queue' ? '#222' : 'transparent',
                color: activeTab === 'queue' ? '#facc15' : '#888',
                border: '1px solid',
                borderColor: activeTab === 'queue' ? '#333' : 'transparent',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Queue</span>
              <span style={{ background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>
                {countQueue}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('success')}
              style={{
                background: activeTab === 'success' ? '#222' : 'transparent',
                color: activeTab === 'success' ? '#4ade80' : '#888',
                border: '1px solid',
                borderColor: activeTab === 'success' ? '#333' : 'transparent',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Successful</span>
              <span style={{ background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>
                {countSuccess}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('failed')}
              style={{
                background: activeTab === 'failed' ? '#222' : 'transparent',
                color: activeTab === 'failed' ? '#f87171' : '#888',
                border: '1px solid',
                borderColor: activeTab === 'failed' ? '#333' : 'transparent',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Failed</span>
              <span style={{ background: '#333', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '11px' }}>
                {countFailed}
              </span>
            </button>

          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
            {filteredUploads.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#666', fontSize: '14px' }}>
                No files in this section.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filteredUploads.map((item, index) => (
                  <div key={item.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '14px 20px',
                    borderBottom: index !== filteredUploads.length - 1 ? '1px solid #1a1a1a' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '18px' }}>
                        {item.status === 'success' ? '✅' : item.status === 'failed' ? '❌' : '⏳'}
                      </span>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '500', margin: '0 0 2px 0', color: '#fff' }}>{item.name}</p>
                        <p style={{ fontSize: '12px', color: item.status === 'failed' ? '#f87171' : '#888', margin: 0 }}>
                          {item.message}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div style={{ fontSize: '13px', color: '#aaa', fontWeight: '500' }}>
                        {item.size}
                      </div>

                      {item.photographerId === CURRENT_USER_ID && (
                        <button 
                          onClick={() => handleDelete(item.id)}
                          style={{
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}