'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

// Simulasi user yang sedang login (Jurufoto A)
const CURRENT_USER_ID = 'user_A'

const MOCK_PHOTOS = [
  { id: 'p1', url: 'https://via.placeholder.com/400', photographer: 'Jurufoto A', photographerId: 'user_A' },
  { id: 'p2', url: 'https://via.placeholder.com/400', photographer: 'Jurufoto B', photographerId: 'user_B' },
  { id: 'p3', url: 'https://via.placeholder.com/400', photographer: 'Jurufoto A', photographerId: 'user_A' },
]

export default function AlbumDetail({ params }: { params: { id: string } }) {
  const [photos, setPhotos] = useState(MOCK_PHOTOS)

  // Fungsi padam (hanya dijalankan jika ID sepadan)
  const handleDelete = (photoId: string) => {
    if (confirm('Are you sure you want to delete your photo?')) {
      setPhotos(photos.filter(p => p.id !== photoId))
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="albums" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ marginBottom: '30px' }}>
          <a href="/photographer/albums" style={{ color: '#888', textDecoration: 'none', fontSize: '12px' }}>← Back to Albums</a>
          <h1 style={{ marginTop: '10px', fontSize: '28px', fontWeight: 'bold' }}>Gallery: Album {params.id}</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
          {photos.map((photo) => (
            <div key={photo.id} style={{ 
              background: '#121212', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              border: '1px solid #222',
              position: 'relative'
            }}>
              <img src={photo.url} alt="Event" style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>Uploaded by</p>
                <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '0 0 10px 0' }}>{photo.photographer}</p>
                
                {/* LOGIK KAWALAN: Butang padam hanya muncul jika photographerId sama dengan CURRENT_USER_ID */}
                {photo.photographerId === CURRENT_USER_ID && (
                  <button 
                    onClick={() => handleDelete(photo.id)}
                    style={{ 
                      background: '#ef4444', 
                      color: '#fff', 
                      border: 'none', 
                      padding: '6px 12px', 
                      borderRadius: '6px', 
                      fontSize: '11px', 
                      cursor: 'pointer',
                      width: '100%'
                    }}
                  >
                    Delete My Photo
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}