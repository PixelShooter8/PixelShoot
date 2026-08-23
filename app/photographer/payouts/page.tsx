'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { supabase } from '@/lib/supabase'

export default function PhotographerPayouts() {
  const [bankInfo, setBankInfo] = useState({ bankName: '', accountHolder: '', accountNumber: '' })
  const [isEditingBank, setIsEditingBank] = useState(false)
  const [isRequestingPayout, setIsRequestingPayout] = useState(false)
  
  const [tempBankName, setTempBankName] = useState('')
  const [tempAccountHolder, setTempAccountHolder] = useState('')
  const [tempAccountNumber, setTempAccountNumber] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')
  const [loading, setLoading] = useState(true)

  // State baki yang diselaraskan dengan Supabase
  const [balanceData, setBalanceData] = useState({
    availableBalance: 0.00,
    pendingBalance: 0.00,
    totalPaidOut: 0.00
  })

  const [payoutHistory, setPayoutHistory] = useState<any[]>([])

  // Ambil data payout, baki, dan maklumat bank dari Supabase secara automatik
  useEffect(() => {
    async function fetchPayoutData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        // 1. Ambil profil bank & baki dari table 'profiles'
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('bank_name, account_holder, account_number, available_balance, pending_balance, total_paid_out')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError.message)
        } else if (profileData) {
          setBankInfo({
            bankName: profileData.bank_name || '',
            accountHolder: profileData.account_holder || '',
            accountNumber: profileData.account_number || ''
          })
          setBalanceData({
            availableBalance: profileData.available_balance || 0.00,
            pendingBalance: profileData.pending_balance || 0.00,
            totalPaidOut: profileData.total_paid_out || 0.00
          })
        }

        // 2. Ambil sejarah pengeluaran (payout history) dari table 'payouts'
        const { data: payoutsData, error: payoutsError } = await supabase
          .from('payouts')
          .select('*')
          .eq('photographer_id', user.id)
          .order('created_at', { ascending: false })

        if (payoutsError) {
          console.error('Error fetching payouts history:', payoutsError.message)
        } else if (payoutsData) {
          setPayoutHistory(payoutsData)
        }

      } catch (err) {
        console.error('Unexpected error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayoutData()
  }, [])

  // Fungsi menyimpan maklumat bank ke Supabase
  const handleSaveBankInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          bank_name: tempBankName,
          account_holder: tempAccountHolder,
          account_number: tempAccountNumber
        })
        .eq('id', user.id)

      if (error) {
        alert('Gagal mengemaskini maklumat bank: ' + error.message)
      } else {
        setBankInfo({
          bankName: tempBankName,
          accountHolder: tempAccountHolder,
          accountNumber: tempAccountNumber
        })
        setIsEditingBank(false)
        alert('Bank account information updated successfully!')
      }
    } catch (err) {
      console.error('Error saving bank info:', err)
    }
  }

  // Fungsi memohon pengeluaran (Request Payout)
  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(payoutAmount)

    if (isNaN(amount) || amount <= 0) {
      alert('Sila masukkan jumlah amaun yang sah.')
      return
    }

    if (amount > balanceData.availableBalance) {
      alert('Amaun melebihi baki tersedia (Available Balance) anda.')
      return
    }

    if (!bankInfo.bankName || !bankInfo.accountNumber) {
      alert('Sila lengkapkan maklumat akaun bank anda terlebih dahulu.')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Masukkan rekod ke dalam table 'payouts'
      const { error: insertError } = await supabase
        .from('payouts')
        .insert({
          photographer_id: user.id,
          amount: amount,
          status: 'Pending',
          bank_name: bankInfo.bankName,
          account_number: bankInfo.accountNumber
        })

      if (insertError) {
        alert('Gagal memohon payout: ' + insertError.message)
        return
      }

      // Kemaskini baki available di table 'profiles'
      const newAvailableBalance = balanceData.availableBalance - amount
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ available_balance: newAvailableBalance })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating balance:', updateError.message)
      }

      setBalanceData(prev => ({
        ...prev,
        availableBalance: newAvailableBalance,
        pendingBalance: prev.pendingBalance + amount
      }))

      setIsRequestingPayout(false)
      setPayoutAmount('')
      alert(`Permohonan payout sebanyak RM ${amount.toFixed(2)} telah berjaya dihantar!`)

    } catch (err) {
      console.error('Error processing payout request:', err)
    }
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="payment" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '35px' }}>
          <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Payouts & Earnings</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
            Manage your earnings, bank account details, and withdrawal history.
          </p>
        </div>

        {/* 3 Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          
          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Available Balance</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#4ade80' }}>
              RM {balanceData.availableBalance.toFixed(2)}
            </h2>
            <button 
              onClick={() => setIsRequestingPayout(true)}
              style={{ 
                background: '#4ade80', 
                color: '#000', 
                border: 'none', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                fontWeight: 'bold', 
                fontSize: '13px', 
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Request Payout
            </button>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Pending Clearance</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#facc15' }}>
              RM {balanceData.pendingBalance.toFixed(2)}
            </h2>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Total Paid Out</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>
              RM {balanceData.totalPaidOut.toFixed(2)}
            </h2>
          </div>

        </div>

        {/* Bank Account Section */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Payout Bank Account</h3>
            <button 
              onClick={() => {
                setTempBankName(bankInfo.bankName)
                setTempAccountHolder(bankInfo.accountHolder)
                setTempAccountNumber(bankInfo.accountNumber)
                setIsEditingBank(true)
              }}
              style={{ 
                background: 'transparent', 
                border: '1px solid #333', 
                color: '#fff', 
                padding: '6px 14px', 
                borderRadius: '6px', 
                fontSize: '12px', 
                cursor: 'pointer' 
              }}
            >
              {bankInfo.bankName ? 'Edit Bank Info' : '+ Add Bank Info'}
            </button>
          </div>

          {bankInfo.bankName ? (
            <div style={{ display: 'flex', gap: '40px', fontSize: '13px' }}>
              <div>
                <p style={{ color: '#888', fontSize: '11px', margin: '0 0 2px 0' }}>Bank Name</p>
                <p style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>{bankInfo.bankName}</p>
              </div>
              <div>
                <p style={{ color: '#888', fontSize: '11px', margin: '0 0 2px 0' }}>Account Holder</p>
                <p style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>{bankInfo.accountHolder}</p>
              </div>
              <div>
                <p style={{ color: '#888', fontSize: '11px', margin: '0 0 2px 0' }}>Account Number</p>
                <p style={{ fontWeight: 'bold', color: '#fff', margin: 0 }}>{bankInfo.accountNumber}</p>
              </div>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#888', margin: 0 }}>
              Tiada akaun bank didaftarkan. Sila tambah maklumat akaun untuk membuat pengeluaran.
            </p>
          )}
        </div>

        {/* Payout History Section */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Payout History</h3>
          </div>

          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
              Memuat data...
            </div>
          ) : payoutHistory.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#666' }}>
              <p style={{ fontSize: '14px', margin: '0 0 4px 0', color: '#888' }}>Tiada rekod pengeluaran buat masa ini</p>
              <p style={{ fontSize: '12px', margin: 0 }}>Sejarah pengeluaran anda akan dipaparkan di sini selepas anda membuat permohonan.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {payoutHistory.map((item: any, index: number) => (
                <div key={item.id || index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px 24px',
                  borderBottom: index !== payoutHistory.length - 1 ? '1px solid #1a1a1a' : 'none'
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>
                      RM {item.amount.toFixed(2)}
                    </p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                      📅 {new Date(item.created_at).toLocaleDateString()} &nbsp;|&nbsp; 🏦 {item.bank_name} ({item.account_number})
                    </p>
                  </div>
                  <div>
                    <span style={{ 
                      fontSize: '12px', 
                      fontWeight: 'bold', 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      background: item.status === 'Completed' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                      color: item.status === 'Completed' ? '#4ade80' : '#facc15'
                    }}>
                      {item.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Edit Bank */}
        {isEditingBank && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#161616', border: '1px solid #333', padding: '30px', borderRadius: '12px', width: '400px' }}>
              <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px', color: '#fff' }}>Edit Bank Information</h3>
              <form onSubmit={handleSaveBankInfo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" value={tempBankName} onChange={(e) => setTempBankName(e.target.value)} placeholder="Bank Name (e.g. Maybank)" style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                <input type="text" value={tempAccountHolder} onChange={(e) => setTempAccountHolder(e.target.value)} placeholder="Account Holder Name" style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                <input type="text" value={tempAccountNumber} onChange={(e) => setTempAccountNumber(e.target.value)} placeholder="Account Number" style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsEditingBank(false)} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#4ade80', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Request Payout */}
        {isRequestingPayout && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#161616', border: '1px solid #333', padding: '30px', borderRadius: '12px', width: '400px' }}>
              <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '10px', color: '#fff' }}>Request Payout</h3>
              <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
                Available Balance: <strong style={{ color: '#4ade80' }}>RM {balanceData.availableBalance.toFixed(2)}</strong>
              </p>
              <form onSubmit={handleRequestPayout} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="number" step="0.01" max={balanceData.availableBalance} value={payoutAmount} onChange={(e) => setPayoutAmount(e.target.value)} placeholder="Enter amount (RM)" style={{ padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsRequestingPayout(false)} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#4ade80', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}