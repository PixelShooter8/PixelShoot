'use client'

import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function PhotographerReports() {
  const [photographerPlan] = useState<'free' | 'subs' | 'premium'>('subs')
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null)

  const getCommissionRate = (plan: 'free' | 'subs' | 'premium') => {
    switch (plan) {
      case 'free': return 0.30;
      case 'subs': return 0.20;
      case 'premium': return 0.10;
      default: return 0.30;
    }
  }

  const platformCommissionRate = getCommissionRate(photographerPlan)
  const paymentGatewayFeeRate = 0.03 // Caj Payment Gateway 3%

  const [salesData] = useState({
    history: [
      { 
        id: '1', 
        event: 'Sarawak Marathon 2026', 
        photosSold: 90, 
        grossEarnings: 720.00, 
        date: '10 July 2026',
        items: [
          { 
            id: '101', 
            fileName: 'IMG_9021.jpg', 
            customerName: 'Ali bin Ahmad', 
            contact: 'ali@gmail.com / 012-3456789', 
            paymentMethod: 'FPX Online Banking', 
            price: 8.00 
          },
          { 
            id: '102', 
            fileName: 'IMG_9022.jpg', 
            customerName: 'Siti Sarah', 
            contact: 'siti@yahoo.com / 019-8765432', 
            paymentMethod: 'Credit / Debit Card', 
            price: 8.00 
          },
        ]
      },
      { 
        id: '2', 
        event: 'Kuching Night Run 2026', 
        photosSold: 65, 
        grossEarnings: 520.00, 
        date: '16 August 2026',
        items: [
          { 
            id: '201', 
            fileName: 'RUN_123.jpg', 
            customerName: 'John Doe', 
            contact: 'john@gmail.com / 011-22334455', 
            paymentMethod: 'DuitNow QR', 
            price: 8.00 
          },
        ]
      },
    ]
  })

  const totalGross = salesData.history.reduce((acc, item) => acc + item.grossEarnings, 0)
  const totalFee = totalGross * platformCommissionRate
  const totalNet = totalGross - totalFee
  const totalPhotos = salesData.history.reduce((acc, item) => acc + item.photosSold, 0)

  // FUNGSI DOWNLOAD PDF KESELURUHAN (HEADER BUTTON)
  const downloadReportPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(18)
    doc.text('Sales & Earnings Report (All Events)', 14, 22)
    doc.setFontSize(11)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)
    
    const tableColumn = ["Event", "Date", "Photos Sold", "Gross (RM)", "Nett (RM)"]
    const tableRows = salesData.history.map(item => [
      item.event,
      item.date,
      item.photosSold.toString(),
      item.grossEarnings.toFixed(2),
      (item.grossEarnings * (1 - platformCommissionRate)).toFixed(2)
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
    })
    
    doc.save('All_Sales_Report.pdf')
  }

  // FUNGSI DOWNLOAD PDF KHUSUS UNTUK SETIAP ALBUM/EVENT
  const downloadEventPDF = (eventItem: any) => {
    const doc = new jsPDF()
    const gross = eventItem.grossEarnings
    const webFee = gross * platformCommissionRate
    const gatewayFee = gross * paymentGatewayFeeRate
    const nett = gross - webFee - gatewayFee

    doc.setFontSize(16)
    doc.text(`Sales Report: ${eventItem.event}`, 14, 20)
    doc.setFontSize(11)
    doc.text(`Date: ${eventItem.date}`, 14, 27)

    // Senarai item / gambar yang terjual dalam event ini
    const tableColumn = ["File Name", "Customer", "Payment Method", "Price (RM)"]
    const tableRows = eventItem.items.map((sub: any) => [
      sub.fileName,
      sub.customerName,
      sub.paymentMethod,
      sub.price.toFixed(2)
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
    })

    // Bahagian Ringkasan Kewangan di bawah jadual
    const finalY = (doc as any).lastAutoTable.finalY + 10
    
    doc.setFontSize(12)
    doc.text('Financial Breakdown:', 14, finalY)
    doc.setFontSize(10)
    doc.text(`• Gross Earnings: RM ${gross.toFixed(2)}`, 14, finalY + 7)
    doc.text(`• Web Fee (${(platformCommissionRate * 100)}%): RM ${webFee.toFixed(2)}`, 14, finalY + 14)
    doc.text(`• Payment Gateway Fee (3%): RM ${gatewayFee.toFixed(2)}`, 14, finalY + 21)
    
    doc.setFontSize(12)
    doc.setTextColor(74, 222, 128) // Warna hijau untuk nett
    doc.text(`• Nett Earnings: RM ${nett.toFixed(2)}`, 14, finalY + 31)

    doc.save(`Report_${eventItem.event.replace(/\s+/g, '_')}.pdf`)
  }

  const toggleEventExpand = (id: string) => {
    setExpandedEventId(expandedEventId === id ? null : id)
  }

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', display: 'flex', color: '#fff', fontFamily: 'sans-serif' }}>
      
      <Sidebar activeTab="sales" />

      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        
        {/* Header & Subscription Tier */}
        <div style={{ marginBottom: '35px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ marginTop: 0, fontSize: '24px', fontWeight: 'bold' }}>Sales & Earnings Report</h1>
            <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>
              Overview of your photo sales performance across shared event albums.
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
            <button 
              onClick={downloadReportPDF}
              style={{ 
                background: '#facc15', 
                color: '#000', 
                padding: '10px 16px', 
                borderRadius: '8px', 
                border: 'none', 
                fontWeight: 'bold', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              📥 Download All PDF
            </button>
            <div style={{ background: '#1a1a1a', border: '1px solid #333', padding: '10px 16px', borderRadius: '8px', textAlign: 'right' }}>
              <p style={{ fontSize: '11px', color: '#888', margin: '0 0 2px 0' }}>Subscription Tier</p>
              <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#facc15', margin: 0, textTransform: 'uppercase' }}>
                {photographerPlan} Plan ({(platformCommissionRate * 100)}% Fee)
              </p>
            </div>
          </div>
        </div>

        {/* 4 Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '35px' }}>
          
          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Gross Earnings</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>RM {totalGross.toFixed(2)}</h2>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Nett Earnings</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#4ade80' }}>RM {totalNet.toFixed(2)}</h2>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Total Photos Sold</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#fff' }}>{totalPhotos}</h2>
          </div>

          <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', padding: '20px' }}>
            <p style={{ color: '#888', fontSize: '12px', margin: '0 0 6px 0' }}>Platform Fee ({(platformCommissionRate * 100)}%)</p>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: '#f87171' }}>RM {totalFee.toFixed(2)}</h2>
          </div>

        </div>

        {/* Event Sales Breakdown */}
        <div style={{ background: '#121212', border: '1px solid #222', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Event Sales Breakdown</h3>
            <span style={{ fontSize: '12px', color: '#888' }}>Click on an event to view transaction details & download report</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {salesData.history.map((item, index) => {
              const itemFee = item.grossEarnings * platformCommissionRate
              const itemNet = item.grossEarnings - itemFee
              const isExpanded = expandedEventId === item.id

              return (
                <div key={item.id} style={{ borderBottom: index !== salesData.history.length - 1 ? '1px solid #1a1a1a' : 'none' }}>
                  
                  {/* Event Main Row */}
                  <div 
                    onClick={() => toggleEventExpand(item.id)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '16px 24px',
                      cursor: 'pointer',
                      background: isExpanded ? '#161616' : 'transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#fff' }}>
                        {item.event} {isExpanded ? '▲' : '▼'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                        📅 {item.date} &nbsp;|&nbsp; 📸 {item.photosSold} photos sold
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 4px 0', color: '#4ade80' }}>
                        Nett: RM {itemNet.toFixed(2)}
                      </p>
                      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                        Gross: RM {item.grossEarnings.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Expanded Transaction Details */}
                  {isExpanded && (
                    <div style={{ background: '#141414', padding: '16px 24px', borderTop: '1px solid #222' }}>
                      
                      {/* Butang Download PDF khusus untuk event ini */}
                      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => downloadEventPDF(item)}
                          style={{
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          📄 Download This Event Report (PDF)
                        </button>
                      </div>

                      <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#facc15', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Transaction & Customer Details:
                      </p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {item.items && item.items.length > 0 ? (
                          item.items.map((subItem) => (
                            <div key={subItem.id} style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              background: '#1a1a1a', 
                              padding: '12px 16px', 
                              borderRadius: '8px',
                              border: '1px solid #222'
                            }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>
                                  📄 File: {subItem.fileName}
                                </span>
                                <span style={{ color: '#ccc', fontSize: '12px' }}>
                                  👤 Buyer: {subItem.customerName} &nbsp;|&nbsp; 📞/✉️ {subItem.contact}
                                </span>
                                <span style={{ color: '#888', fontSize: '11px' }}>
                                  💳 Payment Method: <span style={{ color: '#60a5fa' }}>{subItem.paymentMethod}</span>
                                </span>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <span style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '14px' }}>
                                  RM {subItem.price.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>No detailed records available for this event.</p>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}