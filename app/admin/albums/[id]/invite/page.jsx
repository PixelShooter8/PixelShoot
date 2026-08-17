"use client";

import { useState } from 'react';
import { UserPlus, ArrowLeft, Mail, Copy, Check } from 'lucide-react';
import Link from 'next/link';

export default function InvitePhotographerPage({ params }) {
  const [email, setEmail] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Menggunakan domain www.pixelshooter.my
  const inviteLink = `https://www.pixelshooter.my/invite/${params.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    alert(`Jemputan telah dihantar ke ${email}`);
    setEmail('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div>
        <Link href="/admin/albums" className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Senarai Album
        </Link>
        <h1 className="text-2xl font-bold text-white">Invite Photographer</h1>
        <p className="text-xs text-zinc-400 mt-1">Jemput jurufoto untuk memuat naik gambar ke album ini</p>
      </div>

      {/* Jemputan Emel */}
      <form onSubmit={handleSendInvite} className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase">SEND EMAIL INVITATION</p>
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> PHOTOGRAPHER EMAIL
          </label>
          <input
            type="email"
            required
            placeholder="photographer@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Hantar Jemputan</span>
        </button>
      </form>

      {/* Salin Pautan Jemputan */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3">
        <p className="text-xs font-bold text-zinc-500 tracking-wider uppercase">PAUTAN JEMPUTAN (SHARE LINK)</p>
        <div className="flex items-center bg-zinc-800/80 border border-zinc-700/60 rounded-xl p-1.5 pl-4">
          <input
            type="text"
            readOnly
            value={inviteLink}
            className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleCopy}
            className="bg-zinc-700 hover:bg-zinc-600 text-white p-2.5 rounded-lg transition-colors shrink-0 flex items-center gap-1.5 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Disalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}