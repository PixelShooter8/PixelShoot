"use client";

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Users, 
  Search, 
  UserCheck, 
  UserPlus, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Camera,
  X,
  Send
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPhotographersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // State untuk modal jemputan
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');

  // Senarai jurufoto
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tarik senarai jurufoto dari database Supabase
  useEffect(() => {
    async function fetchPhotographers() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) {
          console.error('Error fetching photographers:', error.message);
        } else if (data) {
          const formatted = data.map((item) => ({
            id: item.id,
            name: item.name || item.full_name || 'Tanpa Nama',
            email: item.email || '',
            phone: item.phone || '-',
            location: item.location || 'Sarawak',
            status: item.status || 'Approved',
            albumsCount: item.albums_count || 0,
            joinedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Terkini'
          }));
          setPhotographers(formatted);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPhotographers();
  }, []);

  // Penapis carian
  const filteredPhotographers = photographers.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.phone && p.phone.includes(searchTerm)) ||
      (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApprove = async (id) => {
    setPhotographers(
      photographers.map((p) =>
        p.id === id ? { ...p, status: 'Approved' } : p
      )
    );
    await supabase.from('profiles').update({ status: 'Approved' }).eq('id', id);
  };

  // Fungsi hantar jemputan emel
  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    try {
      const { error } = await supabase.auth.admin.inviteUserByEmail(inviteEmail, {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        alert('Gagal hantar emel jemputan: ' + error.message);
      } else {
        alert(`Emel jemputan rasmi telah berjaya dihantar ke: ${inviteEmail}`);
        setInviteEmail('');
        setInviteMessage('');
        setIsInviteOpen(false);
      }
    } catch (err) {
      alert('Ralat sistem: ' + err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 relative">
      {/* Header & Butang Invite */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Photographers</h1>
          <p className="text-zinc-400 text-sm mt-0.5">
            Senarai dan pengurusan akaun jurufoto berdaftar SarawakPixel.
          </p>
        </div>
        <button 
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Photographer</span>
        </button>
      </div>

      {/* Kad Statistik Ringkas */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Jumlah Jurufoto</p>
            <h3 className="text-2xl font-bold text-white mt-1">{photographers.length}</h3>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400 font-medium">Melalui Kelulusan</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">
              {photographers.filter((p) => p.status === 'Approved').length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Ruang Carian */}
      <div className="relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari mengikut nama, emel, no. tel, atau kawasan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Senarai Jurufoto */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-zinc-500 text-sm">Memuatkan senarai jurufoto...</div>
        ) : filteredPhotographers.length > 0 ? (
          filteredPhotographers.map((photographer) => (
            <div
              key={photographer.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-black font-bold text-base flex items-center justify-center shrink-0 mt-1 sm:mt-0">
                  {photographer.name.charAt(0)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-base">
                      {photographer.name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        photographer.status === 'Approved'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                      }`}
                    >
                      {photographer.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{photographer.location}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-zinc-400 pt-0.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {photographer.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      {photographer.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3 h-3" /> {photographer.albumsCount} Album
                    </span>
                    <span>•</span>
                    <span>Daftar: {photographer.joinedDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t sm:border-t-0 border-zinc-800/80 pt-3 sm:pt-0">
                {photographer.status === 'Pending' && (
                  <button
                    onClick={() => handleApprove(photographer.id)}
                    className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold px-3 py-1.5 rounded-xl text-xs transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                <button 
                  onClick={() => alert(`Akses profil bagi ${photographer.name}`)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors"
                >
                  Detail
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
            Tiada jurufoto dijumpai.
          </div>
        )}
      </div>

      {/* Modal Popup Jemput Jurufoto */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-bold text-white">Invite Photographer</h2>
              </div>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
                  EMAIL JURUFOTO <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="contoh: jurufoto@gmail.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase mb-1.5">
                  MESEJ TAMBAHAN (OPSIONAL)
                </label>
                <textarea
                  rows={3}
                  placeholder="Sertakan mesej khas atau arahan pendaftaran..."
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full bg-zinc-800/80 border border-zinc-700/60 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Hantar Jemputan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}