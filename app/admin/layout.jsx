'use client'

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
// ... import lain-lain komponen sidebar atau anak-anak layout
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}