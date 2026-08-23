'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Search, Eye, X, CheckCircle, Clock, DollarSign } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Tapisan (Filter) & Carian
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'PAID', atau 'PENDING'
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk Modal Detail View
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();

    // SUPABASE REALTIME V2 (Betul & Disokong)
    const ordersChannel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('Realtime change detected:', payload);
          fetchOrders(); // Tarik semula data secara automatik apabila ada order baru/perubahan
        }
      )
      .subscribe();

    // Cleanup subscription apabila komponen ditutup
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ralat Supabase:', error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  // Pengiraan Statistik
  const paidOrders = orders.filter(o => o.status?.toUpperCase() === 'PAID');
  const pendingOrders = orders.filter(o => o.status?.toUpperCase() === 'PENDING');
  const totalRevenue = paidOrders.reduce((acc, curr) => acc + (Number(curr.amount) || Number(curr.total) || 0), 0);

  // Tapisan Senarai Order mengikut Tab & Carian Searchbar
  const filteredOrders = orders.filter(order => {
    const matchesStatus = 
      statusFilter === 'ALL' ? true :
      statusFilter === 'PAID' ? order.status?.toUpperCase() === 'PAID' :
      order.status?.toUpperCase() === 'PENDING';

    const q = searchQuery.toLowerCase();
    const orderId = (order.order_number || order.id || '').toString().toLowerCase();
    const email = (order.email || order.customer_email || '').toLowerCase();
    const name = (order.name || order.customer_name || '').toLowerCase();

    const matchesSearch = orderId.includes(q) || email.includes(q) || name.includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-8 text-white max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-zinc-400 text-sm">Customer purchases and payment status (Auto-synced)</p>
      </div>

      {/* --- KAD STATISTIK (DIBUAT TAB FILTER) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card Revenue */}
        <div 
          onClick={() => setStatusFilter('ALL')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            statusFilter === 'ALL' 
              ? 'bg-zinc-800 border-zinc-500 shadow-lg' 
              : 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-semibold uppercase mb-2">
            <DollarSign size={16} className="text-amber-500" /> Revenue
          </div>
          <div className="text-2xl font-bold">RM {totalRevenue.toFixed(2)}</div>
          <div className="text-xs text-zinc-500 mt-1">Klik untuk lihat semua ({orders.length})</div>
        </div>

        {/* Card Paid Filter */}
        <div 
          onClick={() => setStatusFilter('PAID')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            statusFilter === 'PAID' 
              ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/20' 
              : 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase mb-2">
            <CheckCircle size={16} /> Paid
          </div>
          <div className="text-2xl font-bold text-emerald-400">{paidOrders.length}</div>
          <div className="text-xs text-zinc-500 mt-1">Order berjaya dibayar</div>
        </div>

        {/* Card Pending Filter */}
        <div 
          onClick={() => setStatusFilter('PENDING')}
          className={`p-5 rounded-2xl border cursor-pointer transition ${
            statusFilter === 'PENDING' 
              ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/20' 
              : 'bg-zinc-900/80 border-zinc-800/80 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase mb-2">
            <Clock size={16} /> Pending
          </div>
          <div className="text-2xl font-bold text-amber-400">{pendingOrders.length}</div>
          <div className="text-xs text-zinc-500 mt-1">Klik untuk tapis order Pending</div>
        </div>

      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-zinc-500" size={18} />
        <input 
          type="text"
          placeholder="Search by email, name, or order ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-zinc-600 transition"
        />
      </div>

      {/* Text penunjuk Status Tab semasa */}
      <div className="text-xs text-zinc-400 flex items-center justify-between">
        <span>
          Menunjukkan: <strong className="text-white">{statusFilter} ORDERS</strong> ({filteredOrders.length})
        </span>
        {statusFilter !== 'ALL' && (
          <button 
            onClick={() => setStatusFilter('ALL')} 
            className="text-amber-500 hover:underline"
          >
            Reset tapisan
          </button>
        )}
      </div>

      {/* --- SENARAI ORDERS --- */}
      {loading ? (
        <p className="text-zinc-500 text-sm">Sedang memuatkan senarai order...</p>
      ) : filteredOrders.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/50 border border-zinc-800 rounded-2xl text-zinc-500 text-sm">
          Tiada rekod order ditemui untuk kategori ini.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => {
            const isPaid = order.status?.toUpperCase() === 'PAID';
            const orderNum = order.order_number || order.id;
            const amount = Number(order.amount || order.total || 0).toFixed(2);
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB') : '-';

            return (
              <div 
                key={order.id}
                className="p-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white text-base">
                    Order #{orderNum}
                  </div>
                  <div className="text-xs text-zinc-500">{dateStr}</div>
                  <div className="text-sm text-zinc-300 font-medium">
                    {order.email || order.customer_email || 'No email provided'}
                  </div>
                  <div className="text-amber-500 font-bold text-sm">
                    RM {amount}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    isPaid 
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' 
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                  }`}>
                    {isPaid ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {isPaid ? 'Paid' : 'Pending'}
                  </span>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-zinc-700/50"
                  >
                    <Eye size={14} /> View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- MODAL DETAIL ORDER --- */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Detail Order #{selectedOrder.order_number || selectedOrder.id}
                </h3>
                <p className="text-xs text-zinc-400">
                  Tarikh: {selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString('en-GB') : '-'}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1 bg-zinc-800 rounded-full hover:bg-zinc-700 text-zinc-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Email Pelanggan:</span>
                <span className="text-white font-medium">{selectedOrder.email || selectedOrder.customer_email || '-'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Nama Pelanggan:</span>
                <span className="text-white font-medium">{selectedOrder.name || selectedOrder.customer_name || 'Pelawat Website'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/50">
                <span className="text-zinc-400">Status Bayaran:</span>
                <span className={`font-bold ${selectedOrder.status?.toUpperCase() === 'PAID' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedOrder.status || 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Jumlah Bayaran:</span>
                <span className="text-amber-500 font-bold text-sm">
                  RM {Number(selectedOrder.amount || selectedOrder.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}