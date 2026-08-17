'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    studioName: '',
    email: '',
    phone: '',
    password: ''
  })
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulasi pendaftaran berjaya
    setSuccessMessage('Account registered successfully! Redirecting to login...')
    
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      
      <div style={{ width: '100%', maxWidth: '420px', padding: '32px', background: '#121212', border: '1px solid #222', borderRadius: '12px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ background: '#facc15', color: '#000', fontWeight: 'bold', width: '42px', height: '42px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
            PS
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff' }}>Join as Photographer</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Create your Pixel Shooter studio account</p>
        </div>

        {successMessage && (
          <div style={{ background: 'rgba(74, 222, 128, 0.1)', border: '1px solid rgba(74, 222, 128, 0.3)', color: '#4ade80', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Studio / Photographer Name</label>
            <input 
              type="text" 
              name="studioName"
              value={formData.studioName}
              onChange={handleChange}
              placeholder="e.g. Ahmad Lens Studio"
              style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Email Address</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ahmad@lensstudio.com"
              style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Phone Number</label>
            <input 
              type="text" 
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+60 12-345 6789"
              style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Password</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <button 
            type="submit"
            style={{ width: '100%', background: '#facc15', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s' }}
          >
            Register Account
          </button>
        </form>

        {/* Link Balik ke Login */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#888' }}>
          <p style={{ margin: 0 }}>
            Already have an account? <Link href="/login" style={{ color: '#facc15', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</Link>
          </p>
        </div>

      </div>
    </div>
  )
}