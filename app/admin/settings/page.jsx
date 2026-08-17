'use client';

import { useState } from 'react';
import { CreditCard, Mail, Percent, Image as ImageIcon, Save, Check, Upload, Trash2, Lock, Type } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  // ToyyibPay State
  const [secretKey, setSecretKey] = useState('');
  const [categoryCode, setCategoryCode] = useState('9qa0yg3b');

  // Resend Email State
  const [resendApiKey, setResendApiKey] = useState('');
  const [senderEmail, setSenderEmail] = useState('noreply@pixelshoot.com');
  const [adminEmail, setAdminEmail] = useState('admin@pixelshoot.com');

  // Platform Fee State
  const [platformFee, setPlatformFee] = useState(25);

  // Watermark State
  const [watermarkType, setWatermarkType] = useState('text'); // 'text' ATAU 'logo'
  const [watermarkText, setWatermarkText] = useState('PIXELSHOOT');
  const [watermarkLogoUrl, setWatermarkLogoUrl] = useState(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkSize, setWatermarkSize] = useState(30);
  const [watermarkPattern, setWatermarkPattern] = useState('Tile + Center');

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWatermarkLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-4 md:p-8 text-white max-w-4xl mx-auto space-y-6 pb-20">
      
      {/* Header Utama PIXELSHOOT */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {/* Logo PIXELSHOOT / Fallback Icon */}
          {watermarkLogoUrl ? (
            <img 
              src={watermarkLogoUrl} 
              alt="Pixelshoot Logo" 
              className="w-10 h-10 object-contain rounded-xl bg-zinc-900 border border-zinc-800 p-1"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-amber-500 text-base">
              PS
            </div>
          )}

          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-white flex items-center gap-2">
              PIXELSHOOT
            </h1>
            <p className="text-zinc-400 text-xs md:text-sm">Pengurusan tetapan sistem Pixelshoot</p>
          </div>
        </div>

        <button
          onClick={handleSaveAll}
          className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm rounded-xl transition shadow-lg"
        >
          <Save size={16} /> Simpan Tetapan
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-400 text-xs md:text-sm rounded-xl flex items-center gap-2">
          <Check size={16} /> Tetapan berjaya disimpan!
        </div>
      )}

      {/* 1. TOYYIBPAY CONFIGURATION */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-amber-500 border-b border-zinc-800 pb-3">
          <CreditCard size={20} /> ToyyibPay Payment Gateway
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">User Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Masukkan Secret Key"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Category Code</label>
            <input
              type="text"
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              placeholder="Contoh: 9qa0yg3b"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* 2. RESEND EMAIL CONFIGURATION */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-purple-400 border-b border-zinc-800 pb-3">
          <Mail size={20} /> Email Services (Resend)
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 font-medium block mb-1">Resend API Key</label>
            <input
              type="password"
              value={resendApiKey}
              onChange={(e) => setResendApiKey(e.target.value)}
              placeholder="re_xxxxxxxxxxxx"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1">Sender Email Address</label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1">Admin Notification Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. PLATFORM FEE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2 font-bold text-lg text-emerald-400 border-b border-zinc-800 pb-3">
          <Percent size={20} /> Platform Fee
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">Komisen Platform (%)</div>
            <div className="text-xs text-zinc-400">
              Photographer akan terima <span className="text-emerald-400 font-bold">{100 - platformFee}%</span> dari setiap jualan.
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              className="w-24 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-center text-sm font-bold text-amber-500 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-sm font-bold">%</span>
          </div>
        </div>
      </div>

      {/* 4. WATERMARK SETTINGS (PIXELSHOOT DEFAULT) */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-lg text-blue-400">
            <ImageIcon size={20} /> Tetapan Watermark Pixelshoot
          </div>
          <span className="flex items-center gap-1 text-[11px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full font-medium">
            <Lock size={12} /> Terkunci untuk semua gambar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Form Inputs */}
          <div className="space-y-4">
            
            {/* Jenis Watermark */}
            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1">Jenis Watermark</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWatermarkType('text')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    watermarkType === 'text'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <Type size={15} /> Teks Sahaja
                </button>
                <button
                  type="button"
                  onClick={() => setWatermarkType('logo')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    watermarkType === 'logo'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <ImageIcon size={15} /> Logo Sahaja
                </button>
              </div>
            </div>

            {/* Input berdasarkan Pilihan */}
            {watermarkType === 'text' ? (
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Teks Watermark</label>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="Contoh: PIXELSHOOT"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold tracking-wider"
                />
              </div>
            ) : (
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Muat Naik Logo Pixelshoot (PNG Transparent)</label>
                <div className="flex items-center gap-2">
                  <label className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl cursor-pointer text-xs text-zinc-300 transition">
                    <Upload size={14} /> Muat Naik Logo PNG
                    <input type="file" accept="image/png" onChange={handleLogoUpload} className="hidden" />
                  </label>
                  {watermarkLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setWatermarkLogoUrl(null)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 transition"
                      title="Padam Logo"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Controls Size & Opacity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Kejelasan / Opacity (%)</label>
                <input
                  type="number"
                  value={watermarkOpacity}
                  onChange={(e) => setWatermarkOpacity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Saiz (%)</label>
                <input
                  type="number"
                  value={watermarkSize}
                  onChange={(e) => setWatermarkSize(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Pattern Selection */}
            <div>
              <label className="text-xs text-zinc-400 font-medium block mb-1">Corak Watermark (Pattern)</label>
              <div className="grid grid-cols-3 gap-2">
                {['Tile + Center', 'Tile Only', 'Center Only'].map((pattern) => (
                  <button
                    key={pattern}
                    type="button"
                    onClick={() => setWatermarkPattern(pattern)}
                    className={`py-2 text-[11px] font-semibold rounded-lg border transition ${
                      watermarkPattern === pattern
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Box */}
          <div className="flex flex-col justify-between bg-zinc-950 border border-zinc-800/80 rounded-xl p-4">
            <div className="text-xs font-semibold text-zinc-400 mb-2 flex justify-between items-center">
              <span>Live Preview</span>
              <span className="text-[10px] text-amber-400">{watermarkPattern}</span>
            </div>
            
            <div className="relative w-full h-48 bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-900 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800">
              
              {/* 1. TILE PATTERN */}
              {(watermarkPattern === 'Tile + Center' || watermarkPattern === 'Tile Only') && (
                <div 
                  style={{ opacity: (watermarkOpacity / 100) * 0.45 }}
                  className="absolute inset-0 grid grid-cols-3 grid-rows-3 p-2 gap-2 pointer-events-none select-none items-center justify-items-center"
                >
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center justify-center -rotate-12 w-full h-full overflow-hidden">
                      {watermarkType === 'text' ? (
                        <span 
                          style={{ fontSize: `${Math.max(6, watermarkSize * 0.35)}px` }}
                          className="font-extrabold text-white/80 tracking-widest uppercase text-center leading-none"
                        >
                          {watermarkText || 'PIXELSHOOT'}
                        </span>
                      ) : (
                        watermarkLogoUrl ? (
                          <img
                            src={watermarkLogoUrl}
                            alt="Tile Logo"
                            style={{ 
                              width: `${Math.max(12, watermarkSize * 0.8)}px`,
                              maxHeight: `${Math.max(12, watermarkSize * 0.8)}px`
                            }}
                            className="object-contain filter brightness-200"
                          />
                        ) : (
                          <span className="text-[8px] text-zinc-500">[No Logo]</span>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* 2. CENTER ELEMENT */}
              {(watermarkPattern === 'Tile + Center' || watermarkPattern === 'Center Only') && (
                <div className="relative z-10 flex items-center justify-center pointer-events-none select-none">
                  {watermarkType === 'text' ? (
                    <span 
                      style={{ 
                        opacity: watermarkOpacity / 100,
                        fontSize: `${Math.max(12, watermarkSize * 0.7)}px`
                      }}
                      className="text-white font-extrabold tracking-widest uppercase text-center px-2 drop-shadow-lg"
                    >
                      {watermarkText || 'PIXELSHOOT'}
                    </span>
                  ) : (
                    watermarkLogoUrl ? (
                      <img
                        src={watermarkLogoUrl}
                        alt="Pixelshoot Watermark Logo"
                        style={{ 
                          opacity: watermarkOpacity / 100,
                          width: `${Math.max(30, watermarkSize * 2.5)}px`
                        }}
                        className="object-contain max-h-24 filter drop-shadow-lg"
                      />
                    ) : (
                      <div className="text-xs text-zinc-500 text-center italic">
                        Sila muat naik fail logo PNG
                      </div>
                    )
                  )}
                </div>
              )}

            </div>
            <div className="text-[10px] text-zinc-500 text-center mt-2">
              Pratonton automatik mengikut saiz & pilihan jenis watermark.
            </div>
          </div>

        </div>
      </div>

      {/* Floating Save Button (Khusus Mobile) */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
        <button
          onClick={handleSaveAll}
          className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm rounded-xl transition shadow-2xl flex items-center justify-center gap-2"
        >
          <Save size={18} /> Simpan Semua Tetapan
        </button>
      </div>

    </div>
  );
}