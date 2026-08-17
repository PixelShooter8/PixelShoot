'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, CheckCircle2, Clock, DollarSign, Wallet, Building2, User } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Filter & Search
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PENDING', 'PAID'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPayouts();
  }, []);

  async function fetchPayouts() {
    setLoading(true);
    const { data, error } = await supabase
      .from('payouts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ralat mengambil payouts:', error);
    } else {
      setPayouts(data || []);
    }
    setLoading(false);
  }

  // Tukar status Payout (misalnya daripada PENDING ke PAID)
  async function handleUpdateStatus(id, newStatus) {
    const { error } = await supabase
      .from('payouts')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Gagal mengemas kini status payout.');
      console.error(error);
    } else {
      // Refresh senarai
      fetchPayouts();
    }
  }

  // Pengiraan Statistik
  const paidPayouts = payouts.filter(p => p.status?.toUpperCase() === 'PAID');
  const pendingPayouts = payouts.filter(p => p.status?.toUpperCase() === 'PENDING');
  
  const totalPaid = paidPayouts.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  const totalPending = pendingPayouts.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

  // Filter mengikut Tab & Search
  const filteredPayouts = payouts.filter(item => {
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'PAID' ? item.status?.toUpperCase() === 'PAID' :
      item.status?.toUpperCase() === 'PENDING';

    const q = searchQuery.toLowerCase();
    const name = (item.photographer_name || '').toLowerCase();
    const email = (item.photographer_email || '').toLowerCase();
    const bank = (item.bank_name || '').toLowerCase();

    const matchesSearch = name.includes(q) || email.includes(q) || bank.includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 text-white max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Photographer Payouts</h1>
        <p className="text-zinc-400 text-sm">Uruskan bayaran komisen & tuntutan hasil jurufoto</p>
      </div>

      {/* --- KAD STATISTIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Kad Total Paid */}
        <div 
          onClick={() => setStatusFilter('PAID')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            statusFilter === 'PAID' 
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg' 
              : 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase mb-2">
            <CheckCircle2 size={16} /> Total Paid Out
          </div>
          <div className="text-2xl font-bold text-emerald-400">RM {totalPaid.toFixed(2)}</div>
          <div className="text-xs text-zinc-500 mt-1">{paidPayouts.length} tuntutan selesai</div>
        </div>

        {/* Kad Pending Payouts */}
        <div 
          onClick={() => setStatusFilter('PENDING')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            statusFilter === 'PENDING' 
              ? 'bg-amber-950/40 border-amber-500 shadow-lg' 
              : 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase mb-2">
            <Clock size={16} /> Pending Payouts
          </div>
          <div className="text-2xl font-bold text-amber-400">RM {totalPending.toFixed(2)}</div>
          <div className="text-xs text-zinc-500 mt-1">{pendingPayouts.length} permohonan menunggu</div>
        </div>

        {/* Kad All Requests */}
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            statusFilter === 'ALL' 
              ? 'bg-zinc-800 border-zinc-500 shadow-lg' 
              : 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase mb-2">
            <Wallet size={16} className="text-amber-500" /> Total Requests
          </div>
          <div className="text-2xl font-bold">{payouts.length}</div>
          <div className="text-xs text-zinc-500 mt-1">Jumlah keseluruhan rekod</div>
        </div>

      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
        <input 
          type="text"
          placeholder="Cari mengikut nama jurufoto, e-mel, atau bank..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition"
        />
      </div>

      {/* --- SENARAI PAYOUTS --- */}
      {loading ? (
        <p className="text-zinc-500 text-sm">Sedang memuatkan senarai payout...</p>
      ) : filteredPayouts.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
          Tiada permohonan payout ditemui.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPayouts.map((item) => {
            const isPaid = item.status?.toUpperCase() === 'PAID';
            const amount = Number(item.amount || 0).toFixed(2);
            const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-';

            return (
              <div 
                key={item.id}
                className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Maklumat Jurufoto & Bank */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white text-base">
                    <User size={16} className="text-amber-500" />
                    {item.photographer_name || 'Jurufoto'}
                    <span className="text-xs text-zinc-500 font-normal">({item.photographer_email || 'No Email'})</span>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-1.5 rounded-lg border border-zinc-800">
                      <Building2 size={14} className="text-zinc-500" />
                      <span>{item.bank_name || 'Bank N/A'}: <strong className="text-zinc-200">{item.account_number || '-'}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-500 self-center">
                      Tarikh Mohon: {dateStr}
                    </div>
                  </div>
                </div>

                {/* Jumlah & Status / Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
                  <div className="text-right">
                    <div className="text-xs text-zinc-500">Jumlah Tuntutan</div>
                    <div className="text-amber-500 font-bold text-lg">RM {amount}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Badge Status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      isPaid 
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                        : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                    }`}>
                      {isPaid ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                      {isPaid ? 'Paid' : 'Pending'}
                    </span>

                    {/* Butang Tandakan Selesai Bayar */}
                    {!isPaid && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'PAID')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}