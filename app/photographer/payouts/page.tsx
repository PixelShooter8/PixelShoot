'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'

export default function PhotographerPayouts() {
  const [photographerPlan] = useState<'free' | 'subs' | 'premium'>('subs')
  
  // State untuk maklumat akaun bank (Dikosongkan untuk akaun baharu)
  const [bankInfo, setBankInfo] = useState({
    bankName: '',
    accountHolder: '',
    accountNumber: ''
  })

  // State untuk mengawal buka/tutup modal
  const [isEditingBank, setIsEditingBank] = useState(false)
  const [isRequestingPayout, setIsRequestingPayout] = useState(false)
  
  // State untuk temp input edit bank
  const [tempBankName, setTempBankName] = useState(bankInfo.bankName)
  const [tempAccountHolder, setTempAccountHolder] = useState(bankInfo.accountHolder)
  const [tempAccountNumber, setTempAccountNumber] = useState(bankInfo.accountNumber)
  
  // State untuk input jumlah payout
  const [payoutAmount, setPayoutAmount] = useState('')

  // Baki akaun ditetapkan kepada 0.00 memandangkan belum ada jualan
  const [balanceData] = useState({
    availableBalance: 0.00,
    pendingBalance: 0.00,
    totalPaidOut: 0.00
  })

  // Sejarah pengeluaran kosong (tiada rekod awal)
  const [payoutHistory] = useState<any[]>([])

  const handleSaveBankInfo = (e: React.FormEvent) => {
    e.preventDefault()
    setBankInfo({ bankName: tempBankName, accountHolder: tempAccountHolder, accountNumber: tempAccountNumber })
    setIsEditingBank(false)
    alert('Bank account information updated successfully!')
  }

  const handleProcessPayout = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(payoutAmount)
    
    if (amount > balanceData.availableBalance) {
      alert('Insufficient balance! You cannot request more than your available balance.')
      return
    }
    
    if (amount <= 0 || isNaN(amount)) {
      alert('Please enter a valid amount.')
      return
    }

    alert(`Payout request of RM ${amount.toFixed(2)} submitted successfully!`)
    setIsRequestingPayout(false)
    setPayoutAmount('')
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="payment" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Payouts & Earnings</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Manage your earnings, bank account details, and withdrawal history.
            </p>
          </div>
        </div>

        {/* Balance Cards & Payout Action */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          
          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Available Balance</p>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#4ade80' }}>
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
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#facc15' }}>
              RM {balanceData.pendingBalance.toFixed(2)}
            </h2>
            <p style={{ color: '#888', fontSize: '11px', margin: 0 }}>
              Will be available after event settlement period.
            </p>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Total Lifetime Paid Out</p>
            <h2 style={{ fontSize: '26px', fontWeight: 'bold', margin: '0 0 6px 0', color: '#fff' }}>
              RM {balanceData.totalPaidOut.toFixed(2)}
            </h2>
            <p style={{ color: '#888', fontSize: '11px', margin: 0 }}>
              Successfully transferred to your bank.
            </p>
          </div>

        </div>

        {/* Bank Account Information */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '35px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Payout Bank Account</h3>
            <button 
              onClick={() => setIsEditingBank(true)}
              style={{ background: 'transparent', border: '1px solid #333', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
            >
              {bankInfo.bankName ? 'Edit Bank Info' : '+ Add Bank Info'}
            </button>
          </div>
          
          {bankInfo.bankName ? (
            <div style={{ display: 'flex', gap: '30px', fontSize: '13px', color: '#ccc' }}>
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
              Tiada akaun bank didaftarkan. Sila klik butang di atas untuk menambah maklumat akaun bank anda.
            </p>
          )}
        </div>

        {/* Modal Request Payout */}
        {isRequestingPayout && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#161616', border: '1px solid #333', padding: '30px', borderRadius: '12px', width: '350px' }}>
              <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '15px' }}>Request Payout</h3>
              <form onSubmit={handleProcessPayout}>
                <label style={{ fontSize: '12px', color: '#888' }}>Amount to withdraw (RM)</label>
                <input 
                  type="number" 
                  value={payoutAmount} 
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  placeholder="0.00"
                  style={{ width: '100%', padding: '10px', marginTop: '8px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }}
                  required 
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setIsRequestingPayout(false)} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#4ade80', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edit Bank */}
        {isEditingBank && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
            <div style={{ background: '#161616', border: '1px solid #333', padding: '30px', borderRadius: '12px', width: '400px' }}>
              <h3 style={{ marginTop: 0, fontSize: '18px', marginBottom: '20px' }}>Edit Bank Information</h3>
              <form onSubmit={handleSaveBankInfo} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Bank Name</label>
                  <input type="text" value={tempBankName} onChange={(e) => setTempBankName(e.target.value)} placeholder="cth: Maybank Berhad" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Account Holder Name</label>
                  <input type="text" value={tempAccountHolder} onChange={(e) => setTempAccountHolder(e.target.value)} placeholder="cth: Ahmad Studio" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '5px' }}>Account Number</label>
                  <input type="text" value={tempAccountNumber} onChange={(e) => setTempAccountNumber(e.target.value)} placeholder="cth: 1642xxxxxxxx" style={{ width: '100%', padding: '10px', background: '#0a0a0a', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} required />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setIsEditingBank(false)} style={{ background: 'transparent', border: '1px solid #444', color: '#ccc', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                  <button type="submit" style={{ background: '#4ade80', color: '#000', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payout History Table */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #222' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Payout History</h3>
          </div>
          
          {payoutHistory.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#666' }}>
              <p style={{ fontSize: '14px', margin: '0 0 4px 0', color: '#888' }}>Tiada rekod payout buat masa ini</p>
              <p style={{ fontSize: '12px', margin: 0 }}>Sejarah pengeluaran wang akan dipaparkan di sini apabila anda mula melakukan jualan.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {payoutHistory.map((payout, index) => (
                <div key={payout.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: index !== payoutHistory.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>{payout.id} - <span style={{ color: '#4ade80' }}>RM {payout.amount.toFixed(2)}</span></p>
                    <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>📅 {payout.date} &nbsp;|&nbsp; 🏦 {payout.method}</p>
                  </div>
                  <div>
                    <span style={{ background: 'rgba(74, 222, 128, 0.1)', color: '#4ade80', border: '1px solid rgba(74, 222, 128, 0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '500' }}>{payout.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}