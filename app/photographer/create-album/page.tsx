'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function CreateEventPage() {
  const [eventName, setEventName] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'found' | 'not_found'>('idle')

  // Simulasi semakan dalam database
  const checkEventExistence = () => {
    setStatus('checking')
    setTimeout(() => {
      // Contoh: Jika taip 'Marathon', anggap acara sudah ada
      if (eventName.toLowerCase().includes('marathon')) {
        setStatus('found')
      } else {
        setStatus('not_found')
      }
    }, 1500)
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      <Sidebar activeTab="upload" />

      <div style={{ flex: 1, padding: '40px', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Cari atau Cipta Acara</h1>
        
        {/* Kotak Carian Acara */}
        <div style={{ background: '#121212', padding: '24px', borderRadius: '12px', border: '1px solid #222' }}>
          <label style={{ fontSize: '14px', color: '#888' }}>Masukkan nama acara untuk disemak:</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <input 
              type="text" 
              value={eventName}
              onChange={(e) => { setEventName(e.target.value); setStatus('idle'); }}
              placeholder="Contoh: Kuching Night Run"
              style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', padding: '12px', borderRadius: '8px', color: '#fff' }}
            />
            <button onClick={checkEventExistence} style={{ background: '#facc15', color: '#000', padding: '0 20px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
              {status === 'checking' ? '...' : 'Semak'}
            </button>
          </div>

          {/* Hasil Semakan */}
          {status === 'found' && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#1e3a8a', borderRadius: '8px', border: '1px solid #3b82f6' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>✅ Acara <strong>"{eventName}"</strong> sudah wujud!</p>
              <button style={{ marginTop: '10px', background: '#fff', color: '#000', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Muat Naik ke Acara Ini
              </button>
            </div>
          )}

          {status === 'not_found' && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#064e3b', borderRadius: '8px', border: '1px solid #10b981' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>⚠️ Acara belum wujud. Anda boleh cipta acara baru ini.</p>
              <button style={{ marginTop: '10px', background: '#facc15', color: '#000', padding: '8px 16px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                Cipta Acara Baru
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}