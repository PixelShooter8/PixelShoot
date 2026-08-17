'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface SidebarProps {
  activeTab: 'home' | 'upload' | 'albums' | 'sales' | 'payment' | 'settings'
}

export default function Sidebar({ activeTab }: SidebarProps) {
  const router = useRouter()

  const handleSignOut = () => {
    // Anda boleh masukkan logik pembersihan token/sesi di sini nanti
    alert('You have been signed out successfully.')
    router.push('/login') // Tukar ke laluan halaman log masuk anda
  }

  const menuItems = [
    { id: 'home', label: 'Home', icon: '🏠', href: '/photographer' },
    { id: 'upload', label: 'Upload Photos', icon: '📤', href: '/photographer/upload' },
    { id: 'albums', label: 'Albums', icon: '📁', href: '/photographer/albums' },
    { id: 'sales', label: 'Sales Report', icon: '📊', href: '/photographer/reports' },
    { id: 'payment', label: 'Payouts', icon: '💳', href: '/photographer/payouts' },
    { id: 'settings', label: 'Settings', icon: '⚙️', href: '/photographer/settings' },
  ]

  return (
    <div style={{
      width: '240px',
      background: '#121212',
      borderRight: '1px solid #222',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'sticky',
      top: 0
    }}>
      {/* Bahagian Logo / Header */}
      <div style={{ marginBottom: '35px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: '#facc15', color: '#000', fontWeight: 'bold', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
          PS
        </div>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#fff', letterSpacing: '0.5px' }}>PIXELSHOOT</h2>
          <span style={{ fontSize: '11px', color: '#facc15', fontWeight: '600' }}>Photographer Panel</span>
        </div>
      </div>

      {/* Senarai Menu Utama */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <Link
              key={item.id}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: isActive ? 'bold' : '500',
                color: isActive ? '#fff' : '#888',
                background: isActive ? '#222' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Butang Sign Out di Bahagian Bawah */}
      <div style={{ paddingTop: '16px', borderTop: '1px solid #222', marginTop: 'auto' }}>
        <button
          onClick={handleSignOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            color: '#f87171',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'background 0.2s ease'
          }}
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}