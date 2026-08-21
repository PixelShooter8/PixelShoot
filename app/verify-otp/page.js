'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabase';

function VerifyOTPContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // 1. Sahkan kod OTP (Recovery Token)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'recovery',
    });

    if (verifyError) {
      setMessage('Ralat Kod: ' + verifyError.message);
      setLoading(false);
      return;
    }

    // 2. Selepas sah, terus kemaskini kata laluan baharu
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setMessage('Ralat Kemaskini: ' + updateError.message);
    } else {
      setMessage('Berjaya! Kata laluan anda telah ditukar. Sila log masuk semula.');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleVerifyAndReset} style={{ width: '100%', maxWidth: '400px', padding: '32px', background: '#121212', border: '1px solid #222', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>Masukkan Kod & Kata Laluan Baharu</h2>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', textAlign: 'center' }}>Semak e-mel anda untuk mendapatkan kod pengesahan.</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>E-mel</label>
          <input 
            type="email" 
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#888', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Kod Pengesahan (OTP)</label>
          <input 
            type="text" 
            placeholder="Masukkan kod 6-digit / token"
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Kata Laluan Baharu</label>
          <input 
            type="password" 
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 14px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button 
          type="submit" 
          style={{ width: '100%', background: '#facc15', color: '#000', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s' }}
          disabled={loading}
        >
          {loading ? 'Sedang diproses...' : 'Tetapkan Semula Kata Laluan'}
        </button>

        {message && <p style={{ marginTop: '16px', fontSize: '12px', textAlign: 'center', color: message.includes('Ralat') ? '#f87171' : '#facc15' }}>{message}</p>}
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/login" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>Kembali ke Log Masuk</a>
        </div>
      </form>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div style={{ color: '#fff', background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memuatkan...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}