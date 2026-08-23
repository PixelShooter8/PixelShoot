'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Simulasi user yang sedang login (Jurufoto A)
const CURRENT_USER_ID = 'Jurufoto A'

interface PhotoItem {
  id: string
  preview_url: string
  original_url: string
  created_at: string
}

export default function AlbumDetail({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [albumTitle, setAlbumTitle] = useState('')

  useEffect(() => {
    fetchAlbumDetailsAndPhotos()
  }, [params.id])

  async function fetchAlbumDetailsAndPhotos() {
    setLoading(true)

    // 1. Ambil tajuk album
    const { data: eventData } = await supabase
      .from('events')
      .select('title')
      .eq('id', params.id)
      .single()

    if (eventData) {
      setAlbumTitle(eventData.title)
    }

    // 2. Ambil senarai gambar daripada jadual 'photos' untuk event ini
    const { data: photosData, error } = await supabase
      .from('photos')
      .select('*')
      .eq('event_id', params.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Ralat mengambil gambar:', error.message)
    } else {
      setPhotos(photosData || [])
    }

    setLoading(false)
  }

  // Fungsi padam gambar dari database & storage
  const handleDelete = async (photoId: string) => {
    if (confirm('Adakah anda pasti mahu memadam gambar ini?')) {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId)

      if (error) {
        alert('Gagal memadam gambar: ' + error.message)
      } else {
        setPhotos(photos.filter(p => p.id !== photoId))
        alert('Gambar berjaya dipadam!')
      }
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      <Sidebar activeTab="albums" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <a href="/photographer/albums" style={{ color: '#888', textDecoration: 'none', fontSize: '12px' }}>← Back to Albums</a>
          <h1 style={{ marginTop: '10px', fontSize: '28px', fontWeight: 'bold' }}>
            Gallery: {albumTitle || `Album ${params.id}`}
          </h1>
          <p style={{ color: '#888', fontSize: '14px' }}>Jumlah gambar dalam album: {photos.length}</p>
        </div>

        {loading ? (
          <p style={{ color: '#888' }}>Memuatkan gambar dari pangkalan data...</p>
        ) : photos.length === 0 ? (
          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: '14px', marginBottom: '15px' }}>Tiada gambar lagi dalam album ini.</p>
            <a href="/photographer/upload" style={{ background: '#facc15', color: '#000', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none' }}>
              📤 Muat Naik Gambar Sekarang
            </a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {photos.map((photo) => (
              <div key={photo.id} style={{ 
                background: '#121212', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                border: '1px solid #222',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <img 
                  src={photo.preview_url || photo.original_url} 
                  alt="Event Photo" 
                  style={{ width: '100%', height: '160px', objectFit: 'cover' }} 
                />

                <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '11px', color: '#888', margin: '0 0 10px 0' }}>
                    Dimuat naik pada: {new Date(photo.created_at).toLocaleDateString()}
                  </p>

                  <button 
                    onClick={() => handleDelete(photo.id)}
                    style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Padam Gambar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}