'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const supabase = createClientComponentClient();

  const handleReset = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: password });

    if (error) {
      setMessage('Ralat: ' + error.message);
    } else {
      setMessage('Berjaya! Kata laluan anda telah dikemaskini.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleReset} className="p-8 bg-gray-800 rounded">
        <h2 className="text-xl text-white mb-4">Tukar Kata Laluan Baru</h2>
        <input 
          type="password" 
          placeholder="Masukkan kata laluan baharu"
          className="p-2 w-full mb-4 text-black"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-yellow-500 text-black px-4 py-2 w-full">
          Kemaskini Kata Laluan
        </button>
        {message && <p className="mt-4 text-white">{message}</p>}
      </form>
    </div>
  );
}