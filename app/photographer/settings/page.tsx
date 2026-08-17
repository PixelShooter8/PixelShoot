'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function PhotographerSettings() {
  const [profile, setProfile] = useState({
    name: 'Ahmad Lens Studio',
    email: 'ahmad@lensstudio.com',
    phone: '+60 12-345 6789',
    bio: 'Professional event & wedding photographer based in Kuala Lumpur.',
  })

  const [notifications, setNotifications] = useState({
    emailOnSale: true,
    emailOnPayout: true,
    browserAlerts: false,
  })

  // Data prestasi jurufoto (tanpa client rating)
  const [statsData] = useState({
    photosSold: 1420,
    totalEarnings: 12450.00,
    albumViews: 8930,
    memberSince: 'January 2025'
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Profile settings updated successfully!')
  }

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="settings" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Settings</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
            Manage your account details, preferences, and public performance stats.
          </p>
        </div>

        {/* Layout 2 Kolum: Kiri (Borang), Kanan (Statistik & Rekod Profil) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '30px', alignItems: 'start' }}>
          
          {/* KOLUM KIRI: Tetapan Profil, Notifikasi & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            
            {/* Profile Information Form */}
            <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px 0' }}>Profile Information</h3>
              
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Studio / Photographer Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={profile.name} 
                    onChange={handleProfileChange}
                    style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
                    required 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={profile.email} 
                      onChange={handleProfileChange}
                      style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
                      required 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                    <input 
                      type="text" 
                      name="phone" 
                      value={profile.phone} 
                      onChange={handleProfileChange}
                      style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px' }}
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Bio / Description</label>
                  <textarea 
                    name="bio" 
                    value={profile.bio} 
                    onChange={handleProfileChange}
                    rows={3}
                    style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit"
                    style={{ background: '#4ade80', color: '#000', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>

            {/* Notification Preferences */}
            <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 20px 0' }}>Notification Preferences</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0' }}>Email on New Sale</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Receive an email notification when a client purchases.</p>
                  </div>
                  <input type="checkbox" checked={notifications.emailOnSale} onChange={() => handleNotificationToggle('emailOnSale')} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #1a1a1a', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0' }}>Email on Payout Processed</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Get notified when payout is transferred.</p>
                  </div>
                  <input type="checkbox" checked={notifications.emailOnPayout} onChange={() => handleNotificationToggle('emailOnPayout')} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #1a1a1a', margin: '4px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 2px 0' }}>Browser Push Alerts</p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>Show desktop popup alerts for instant updates.</p>
                  </div>
                  <input type="checkbox" checked={notifications.browserAlerts} onChange={() => handleNotificationToggle('browserAlerts')} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                </div>
              </div>
            </div>

            {/* Security */}
            <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#f87171' }}>Security</h3>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 16px 0' }}>Ensure your account is secure by updating your password regularly.</p>
              <button onClick={() => alert('Password reset link sent.')} style={{ background: 'transparent', border: '1px solid #444', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}>
                Change Password
              </button>
            </div>

          </div>

          {/* KOLUM KANAN: Rekod Prestasi & Statistik Profil */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px 0' }}>Photographer Track Record</h3>
              <p style={{ fontSize: '12px', color: '#888', margin: '0 0 20px 0' }}>
                Your milestone and sales history to showcase credibility.
              </p>

              {/* Stats Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                
                <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 2px 0' }}>Photos Sold</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{statsData.photosSold.toLocaleString()} items</p>
                  </div>
                  <span style={{ fontSize: '18px' }}>📸</span>
                </div>

                <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 2px 0' }}>Total Lifetime Earnings</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#4ade80', margin: 0 }}>RM {statsData.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                  <span style={{ fontSize: '18px' }}>💰</span>
                </div>

                <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 2px 0' }}>Total Album Views</p>
                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{statsData.albumViews.toLocaleString()} visits</p>
                  </div>
                  <span style={{ fontSize: '18px' }}>👁️‍🗨️</span>
                </div>

                <div style={{ background: '#181818', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#888', margin: '0 0 2px 0' }}>Platform Member Since</p>
                    <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#ccc', margin: 0 }}>{statsData.memberSince}</p>
                  </div>
                  <span style={{ fontSize: '18px' }}>🛡️</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}