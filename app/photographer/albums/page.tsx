'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

interface Album {
  id: string
  title: string
  date: string
  location: string
  totalPhotos: number
  badge: string
  badgeColor: string
  publicUrl: string
}

export default function PhotographerAlbums() {
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: '1',
      title: 'Sarawak Marathon 2026',
      date: '09 July 2026',
      location: 'Kuching',
      totalPhotos: 1250,
      badge: 'LATEST',
      badgeColor: '#facc15',
      publicUrl: 'https://pixelshooter.com/events/sarawak-marathon-2026'
    },
    {
      id: '2',
      title: 'Kuching Night Run 2026',
      date: '15 August 2026',
      location: 'Kuching',
      totalPhotos: 840,
      badge: 'POPULAR',
      badgeColor: '#38bdf8',
      publicUrl: 'https://pixelshooter.com/events/kuching-night-run-2026'
    },
    {
      id: '3',
      title: 'Borneo Cycling Challenge',
      date: '02 September 2026',
      location: 'Miri',
      totalPhotos: 0,
      badge: 'ACTIVE',
      badgeColor: '#4ade80',
      publicUrl: 'https://pixelshooter.com/events/borneo-cycling-challenge'
    }
  ])

  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newLocation, setNewLocation] = useState('')

  // Fungsi Cipta Album Dengan Pemeriksaan Pertindihan (Duplicate Check)
  const handleCreateAlbum = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newDate || !newLocation) {
      alert('Please fill in all details for the new event album.')
      return
    }

    // Semak sama ada tajuk album sudah wujud (mengelakkan event bertindih)
    const normalizedTitle = newTitle.trim().toLowerCase()
    const isExists = albums.some(album => album.title.trim().toLowerCase() === normalizedTitle)

    if (isExists) {
      alert(`Error: An album with the name "${newTitle}" already exists! To avoid duplicates, please upload your photos directly to the existing event album.`)
      return
    }

    // Jika belum wujud, cipta album baharu
    const newId = (albums.length + 1).toString()
    const slug = normalizedTitle.replace(/[^a-z0-9]+/g, '-')

    const newAlbum: Album = {
      id: newId,
      title: newTitle,
      date: newDate,
      location: newLocation,
      totalPhotos: 0,
      badge: 'NEW',
      badgeColor: '#facc15',
      publicUrl: `https://pixelshooter.com/events/${slug}`
    }

    setAlbums([newAlbum, ...albums])
    setNewTitle('')
    setNewDate('')
    setNewLocation('')
    setShowNewModal(false)
    alert('New unified event album created successfully! All photographers can now share this single link.')
  }

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Official shared event link copied to clipboard!')
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="albums" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Tajuk Halaman & Butang Tambah Album */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div>
            <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Event Albums Management</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Create a unified event album only if it does not exist yet. All photographers share the same link.
            </p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            style={{
              background: '#facc15',
              color: '#000',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(250, 204, 21, 0.2)'
            }}
          >
            + Create New Event Album
          </button>
        </div>

        {/* Modal Borang Tambah Album */}
        {showNewModal && (
          <div style={{ 
            background: '#121212', 
            border: '1px solid #333', 
            borderRadius: '12px', 
            padding: '24px', 
            maxWidth: '600px', 
            marginBottom: '35px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '15px', color: '#fff' }}>Create New Unified Event Album</h3>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
              Note: System will check to prevent duplicate events. Make sure the event name is accurate.
            </p>
            <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>Event Title</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="e.g., Nama Event"
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="text" 
                    value={newDate} 
                    onChange={(e) => setNewDate(e.target.value)} 
                    placeholder="e.g., 10 October 2026"
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>Location</label>
                  <input 
                    type="text" 
                    value={newLocation} 
                    onChange={(e) => setNewLocation(e.target.value)} 
                    placeholder="e.g., Miri"
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowNewModal(false)}
                  style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ background: '#facc15', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                >
                  Publish Album
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Senarai Kad Album */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {albums.map((album) => (
            <div 
              key={album.id}
              style={{ 
                background: '#121212', 
                border: '1px solid #222', 
                borderRadius: '12px', 
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ height: '120px', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px' }}>
                📁 Official Event Cover
              </div>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ background: album.badgeColor, color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                    {album.badge}
                  </span>
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    📸 {album.totalPhotos} total photos
                  </span>
                </div>
                
                <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#fff' }}>{album.title}</h3>
                <p style={{ fontSize: '12px', color: '#888', margin: '0 0 15px 0' }}>📅 {album.date} • 📍 {album.location}</p>

                <div style={{ background: '#1a1a1a', padding: '8px 12px', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                    {album.publicUrl}
                  </span>
                  <button 
                    onClick={() => copyToClipboard(album.publicUrl)}
                    style={{ background: '#333', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Copy Link
                  </button>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                  <a 
                    href={`/photographer/albums/${album.id}`}
                    style={{ 
                      flex: 1,
                      background: '#222', 
                      color: '#fff', 
                      textAlign: 'center', 
                      padding: '10px', 
                      borderRadius: '8px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      textDecoration: 'none'
                    }}
                  >
                    View Gallery
                  </a>
                  <a 
                    href="/photographer/upload"
                    style={{ 
                      background: '#facc15', 
                      color: '#000', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '10px 14px', 
                      borderRadius: '8px', 
                      fontSize: '13px', 
                      fontWeight: 'bold',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    📤 Upload Photos
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}