'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function PhotographerHome() {
  const [searchType, setSearchType] = useState('bib')
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchValue && searchType === 'bib') {
      alert('Please enter a BIB number first.')
      return
    }
    alert(`Searching photos using ${searchType === 'bib' ? 'BIB No: ' + searchValue : 'AI Selfie'}`)
  }

  const albums = [
    {
      id: 1,
      title: 'Sarawak Marathon 2026',
      date: '09 July 2026',
      location: 'Kuching',
      badge: 'LATEST',
      badgeColor: '#facc15',
      link: '/photographer/albums/1'
    },
    {
      id: 2,
      title: 'Kuching Night Run 2026',
      date: '15 August 2026',
      location: 'Kuching',
      badge: 'POPULAR',
      badgeColor: '#38bdf8',
      link: '/photographer/albums/2'
    },
    {
      id: 3,
      title: 'Borneo Cycling Challenge',
      date: '02 September 2026',
      location: 'Miri',
      badge: 'ACTIVE',
      badgeColor: '#4ade80',
      link: '/photographer/albums/3'
    }
  ]

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="home" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Photographer Dashboard</h1>
          <p style={{ color: '#888', fontSize: '14px' }}>Search events or check your race album status quickly.</p>
        </div>

        <form onSubmit={handleSearch} style={{ 
          background: '#121212', 
          border: '1px solid #222', 
          borderRadius: '16px', 
          padding: '30px', 
          maxWidth: '800px', 
          marginBottom: '50px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
        }}>
          <p style={{ textAlign: 'center', color: '#aaa', fontSize: '14px', marginBottom: '20px' }}>
            Enter participant BIB number or check event album upload records.
          </p>

          <div style={{ display: 'flex', background: '#1a1a1a', padding: '4px', borderRadius: '10px', marginBottom: '25px', maxWidth: '400px', margin: '0 auto 25px auto' }}>
            <button 
              type="button"
              onClick={() => setSearchType('bib')}
              style={{
                flex: 1,
                background: searchType === 'bib' ? '#facc15' : 'transparent',
                color: searchType === 'bib' ? '#000' : '#aaa',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              🔍 BIB Number Search
            </button>
            <button 
              type="button"
              onClick={() => setSearchType('selfie')}
              style={{
                flex: 1,
                background: searchType === 'selfie' ? '#facc15' : 'transparent',
                color: searchType === 'selfie' ? '#000' : '#aaa',
                border: 'none',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.2s'
              }}
            >
              📸 AI Selfie Search
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', maxWidth: '650px', margin: '0 auto' }}>
            {searchType === 'bib' ? (
              <input 
                type="text" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="e.g., 8821 or A-102" 
                style={{
                  flex: 1,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '14px 16px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            ) : (
              <input 
                type="file" 
                accept="image/*"
                onChange={() => alert('Selfie file selected for AI search!')}
                style={{
                  flex: 1,
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  color: '#fff',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            )}
            
            <button type="submit" style={{
              background: '#facc15',
              color: '#000',
              border: 'none',
              padding: '0 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap'
            }}>
              Search Photos →
            </button>
          </div>
        </form>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Featured Event Albums</h2>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>Select a running event to view the full gallery and upload status.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {albums.map((album) => (
              <a 
                key={album.id}
                href={album.link}
                style={{ 
                  background: '#121212', 
                  border: '1px solid #222', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  transition: 'transform 0.2s, border-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.borderColor = '#facc15'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.borderColor = '#222'
                }}
              >
                <div style={{ height: '130px', background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>🖼️ Event Photo</div>
                <div style={{ padding: '16px' }}>
                  <span style={{ background: album.badgeColor, color: '#000', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                    {album.badge}
                  </span>
                  <h3 style={{ fontSize: '15px', margin: '10px 0 6px 0', color: '#fff' }}>{album.title}</h3>
                  <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>📅 {album.date} • 📍 {album.location}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}