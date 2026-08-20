'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Sesi pemulihan aktif
      }
    });
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.updateUser({ 
      password: password 
    });

    if (error) {
      setMessage('Ralat: ' + error.message);
    } else {
      setMessage('Berjaya! Kata laluan anda telah dikemaskini. Sila log masuk semula.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleReset} style={{ width: '100%', maxWidth: '400px', padding: '32px', background: '#121212', border: '1px solid #222', borderRadius: '12px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', textAlign: 'center' }}>Tetapan Semula Kata Laluan</h2>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '24px', textAlign: 'center' }}>Masukkan kata laluan baharu anda di bawah.</p>
        
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
          {loading ? 'Sedang dikemaskini...' : 'Kemaskini Kata Laluan'}
        </button>

        {message && <p style={{ marginTop: '16px', fontSize: '12px', textAlign: 'center', color: message.includes('Ralat') ? '#f87171' : '#facc15' }}>{message}</p>}
        
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <a href="/login" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>Kembali ke Log Masuk</a>
        </div>
      </form>
    </div>
  );
}