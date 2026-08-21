import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

// Di dalam komponen sidebar anda:
const [userEmail, setUserEmail] = useState('');
const [userName, setUserName] = useState('');

useEffect(() => {
  async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserEmail(user.email || '');
      setUserName(user.user_metadata?.full_name || 'Admin');
    }
  }
  getUser();
}, []);