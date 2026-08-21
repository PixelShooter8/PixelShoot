"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { 
  LayoutDashboard, 
  Folder, 
  Users, 
  ShoppingBag, 
  Wallet, 
  BarChart3, 
  Settings, 
  Globe, 
  LogOut 
} from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Albums', icon: Folder, href: '/admin/albums' },
  { label: 'Photographers', icon: Users, href: '/admin/photographers' },
  { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { label: 'Payouts', icon: Wallet, href: '/admin/payouts' },
  { label: 'Sales Report', icon: BarChart3, href: '/admin/sales-report' },
  { label: 'Settings', icon: Settings, href: '/admin/settings' },
];

export default function AdminSidebar() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('Memuatkan...');
  const [userName, setUserName] = useState('Admin');
  const [userInitial, setUserInitial] = useState('A');

  // Auto-detect maklumat pengguna yang sedang log masuk
  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const email = user.email || '';
        setUserEmail(email);
        
        // Ambil nama dari metadata atau guna bahagian depan e-mel
        const name = user.user_metadata?.full_name || email.split('@')[0];
        setUserName(name);
        
        // Ambil huruf pertama untuk avatar bulat
        setUserInitial(name.charAt(0).toUpperCase());
      }
    }
    fetchUser();
  }, []);

  // Fungsi Sign Out sebenar dengan Supabase
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-black text-zinc-300 min-h-screen p-4 flex flex-col justify-between border-r border-zinc-800">
      <div>
        {/* Tajuk Logo */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="bg-amber-500 p-2 rounded-lg text-black font-bold">PS</div>
          <div>
            <h1 className="font-bold text-white text-base leading-none">PIXELSHOOT</h1>
            <p className="text-xs text-amber-500 font-medium mt-1">Admin Panel</p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <p className="text-[10px] text-zinc-500 font-bold tracking-wider mb-2 px-2 uppercase">Management</p>
        <nav className="space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                <Icon className="w-4 h-4 text-zinc-400" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Profil & Sign Out */}
      <div className="border-t border-zinc-800 pt-4 space-y-2">
        <a 
          href="/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white"
        >
          <Globe className="w-4 h-4" /> View Public Site
        </a>

        {/* Butang Sign Out (Ditukar kepada button interaktif) */}
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-500 hover:text-red-400 w-full text-left transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        
        {/* Kad Profil Admin (Auto-Detect Dinamik) */}
        <div className="flex items-center gap-3 bg-zinc-900/80 p-2.5 rounded-xl mt-2 border border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-black font-bold text-xs flex items-center justify-center shrink-0">
            {userInitial}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate capitalize">{userName}</p>
            <p className="text-[10px] text-zinc-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}