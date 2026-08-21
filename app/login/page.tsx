'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/utils/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Semak terus dengan Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Jika berjaya, masuk ke dashboard jurufoto
      router.push('/photographer')
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', background: '#121212', border: '1px solid #222', borderRadius: '12px' }}>
        
        {/* Logo / Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ background: '#facc15', color: '#000', fontWeight: 'bold', width: '42px', height: '42px', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '12px' }}>
            PS
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff' }}>Welcome Back</h1>
          <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>Sign in to your Pixel Shooter account</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.3)', color: '#f87171', padding: '10px 14px', borderRadius: '8px', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ahmad@lensstudio.com"
              style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              required 
            />
            {/* Pautan Lupa Kata Laluan */}
            <div style={{ textAlign: 'right', marginTop: '6px' }}>
              <Link href="/forgot-password" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>
                Forgot password?
              </Link>
            </div>
          </div>

          <button 
            type="submit"
            style={{ width: '100%', background: '#facc15', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '6px', transition: 'opacity 0.2s' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Info Tambahan */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#888' }}>
          <p style={{ margin: 0 }}>
            Don't have an account? <Link href="/register" style={{ color: '#facc15', textDecoration: 'none' }}>Register as Photographer</Link>
          </p>
        </div>

      </div>
    </div>
  )
}