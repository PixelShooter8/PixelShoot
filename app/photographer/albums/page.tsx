'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

interface Album {
  id: string
  title: string
  date: string
  location: string
  status?: string
}

export default function PhotographerAlbums() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newLocation, setNewLocation] = useState('')

  useEffect(() => {
    fetchAlbums()
  }, [])

  async function fetchAlbums() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching albums:', error.message)
    } else {
      setAlbums(data || [])
    }
    setLoading(false)
  }

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle || !newDate || !newLocation) {
      alert('Please fill in all details for the new event album.')
      return
    }

    const { error } = await supabase
      .from('events')
      .insert([
        { 
          title: newTitle, 
          date: newDate, 
          location: newLocation,
          status: 'Published'
        }
      ])

    if (error) {
      alert('Error creating album: ' + error.message)
    } else {
      alert('New unified event album created successfully!')
      setNewTitle('')
      setNewDate('')
      setNewLocation('')
      setShowNewModal(false)
      fetchAlbums()
    }
  }

  const copyToClipboard = (id: string) => {
    // Dijana ke link public event supaya peserta/orang awam boleh akses
    const url = `${window.location.origin}/events/${id}`
    navigator.clipboard.writeText(url)
    alert('Public event link copied to clipboard!')
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      <Sidebar activeTab="albums" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div>
            <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Event Albums Management</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Create a unified event album. All photographers share the same database and links.
            </p>
          </div>
          <button 
            onClick={() => setShowNewModal(true)}
            style={{
              background: '#facc15', color: '#000', border: 'none', padding: '12px 20px',
              borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer'
            }}
          >
            + Create New Event Album
          </button>
        </div>

        {showNewModal && (
          <div style={{ background: '#121212', border: '1px solid #333', borderRadius: '12px', padding: '24px', maxWidth: '600px', marginBottom: '35px' }}>
            <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '15px', color: '#fff' }}>Create New Unified Event Album</h3>
            <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>Event Title</label>
                <input 
                  type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="e.g., Marathon 2026"
                  style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>Date</label>
                  <input 
                    type="text" value={newDate} onChange={(e) => setNewDate(e.target.value)} 
                    placeholder="e.g., 2026-09-05"
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none' }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', color: '#aaa', marginBottom: '6px' }}>Location</label>
                  <input 
                    type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} 
                    placeholder="e.g., Kuching"
                    style={{ width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', color: '#fff', outline: 'none' }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowNewModal(false)} style={{ background: 'transparent', color: '#aaa', border: '1px solid #333', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ background: '#facc15', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Publish Album</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {loading ? (
            <p style={{ color: '#888' }}>Loading albums from database...</p>
          ) : albums.length === 0 ? (
            <p style={{ color: '#888' }}>No albums found in database.</p>
          ) : (
            albums.map((album) => (
              <div key={album.id} style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '120px', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', fontSize: '14px' }}>
                  📁 Official Event Cover
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ background: '#facc15', color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                      {album.status || 'ACTIVE'}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '16px', margin: '0 0 8px 0', color: '#fff' }}>{album.title}</h3>
                  <p style={{ fontSize: '12px', color: '#888', margin: '0 0 15px 0' }}>📅 {album.date} • 📍 {album.location || 'No location'}</p>

                  <div style={{ background: '#1a1a1a', padding: '8px 12px', borderRadius: '6px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#aaa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}>
                      {typeof window !== 'undefined' ? `${window.location.origin}/events/${album.id}` : `/events/${album.id}`}
                    </span>
                    <button onClick={() => copyToClipboard(album.id)} style={{ background: '#333', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Copy Link
                    </button>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <a href={`/photographer/albums/${album.id}`} style={{ flex: 1, background: '#222', color: '#fff', textAlign: 'center', padding: '10px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
                      View Gallery
                    </a>
                    <a href="/photographer/upload" style={{ background: '#facc15', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none' }}>
                      📤 Upload
                    </a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}