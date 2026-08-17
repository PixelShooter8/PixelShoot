'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  Image as ImageIcon, 
  Calendar, 
  MapPin,
  HelpCircle,
  Download,
  ShieldCheck,
  Mail,
  Send,
  User,
  Hash,
  Phone,
  MessageSquare
} from 'lucide-react';

export default function PublicHomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bib' | 'selfie'>('bib');
  const [bibNumber, setBibNumber] = useState('');

  // State untuk borang Contact Us
  const [contactName, setContactName] = useState('');
  const [contactRef, setContactRef] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const featuredAlbums = [
    {
      id: 'maraton-kuching-2026',
      title: 'Kuching Marathon 2026',
      date: 'August 12, 2026',
      location: 'Padang Merdeka, Kuching',
      photoCount: '12,500+',
      coverUrl: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=1000&auto=format&fit=crop',
      badge: 'Latest'
    },
    {
      id: 'santubong-trail-2026',
      title: 'Santubong Trail Run 2026',
      date: 'August 01, 2026',
      location: 'Santubong National Park',
      photoCount: '8,200+',
      coverUrl: 'https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?q=80&w=1000&auto=format&fit=crop',
      badge: 'Popular'
    },
    {
      id: 'sarawak-night-run-2026',
      title: 'Sarawak Night City Run',
      date: 'July 20, 2026',
      location: 'Kuching Waterfront',
      photoCount: '15,000+',
      coverUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1000&auto=format&fit=crop',
      badge: ''
    }
  ];

  const handleBibSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bibNumber.trim()) return;
    router.push(`/album/maraton-kuching-2026?bib=${encodeURIComponent(bibNumber.trim())}`);
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Gantikan nombor di bawah dengan nombor WhatsApp anda (Contoh: 60123456789 tanpa simbol +)
    const adminWhatsAppNumber = '60168625143'; 

    const text = `*CUSTOMER INQUIRY - PIXELSHOOT*%0A%0A` +
      `*Name:* ${encodeURIComponent(contactName)}%0A` +
      `*Reference / BIB No.:* ${encodeURIComponent(contactRef || 'None')}%0A` +
      `*Customer WhatsApp:* ${encodeURIComponent(contactPhone)}%0A` +
      `*Message:*%0A${encodeURIComponent(contactMessage)}`;

    window.open(`https://wa.me/${adminWhatsAppNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500 selection:text-black">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-amber-500 w-10 h-10 rounded-xl flex items-center justify-center font-black text-black text-lg group-hover:scale-105 transition-transform shadow-lg shadow-amber-500/20">
              PS
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-wider text-white block leading-none">
                PIXEL<span className="text-amber-500">SHOOT</span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase block mt-1">
                Event Photography Portal
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-zinc-300">
            <a href="#albums" className="hover:text-amber-500 transition-colors">EVENT ALBUMS</a>
            <a href="#how-it-works" className="hover:text-amber-500 transition-colors">HOW IT WORKS</a>
            <a href="#contact" className="hover:text-amber-500 transition-colors flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-500" /> CONTACT US
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link 
              href="/login" 
              className="text-xs font-semibold px-4 py-2.5 rounded-xl border border-zinc-800 text-zinc-300 hover:border-amber-500 hover:text-white transition-all"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </header>

      {/* HERO & SEARCH */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-zinc-900">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Facial Recognition & Instant BIB Search</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Find & Download Your Race Photos in <span className="text-amber-500">Seconds</span>.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            Enter your race BIB number or upload a selfie to let PIXELSHOOT's AI detect all your best event photos instantly.
          </p>

          <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 md:p-6 shadow-2xl max-w-2xl mx-auto text-left mt-8">
            <div className="flex bg-zinc-900 p-1 rounded-xl mb-6 border border-zinc-800">
              <button
                type="button"
                onClick={() => setActiveTab('bib')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'bib' 
                    ? 'bg-amber-500 text-black shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" /> BIB Number Search
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('selfie')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
                  activeTab === 'selfie' 
                    ? 'bg-amber-500 text-black shadow' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4" /> AI Selfie Search
              </button>
            </div>

            {activeTab === 'bib' ? (
              <form onSubmit={handleBibSearch} className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Enter Your Race BIB Number
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={bibNumber}
                      onChange={(e) => setBibNumber(e.target.value)}
                      placeholder="e.g., 8821 or A-102"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3 rounded-xl text-sm transition flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Search Photos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Upload a Clear Face Selfie
                </label>
                <div className="border-2 border-dashed border-zinc-800 hover:border-amber-500/50 rounded-xl p-6 text-center bg-zinc-900/50 cursor-pointer transition group">
                  <Camera className="w-8 h-8 text-amber-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-white font-semibold">Click or drag & drop your selfie here</p>
                  <p className="text-[10px] text-zinc-500 mt-1">Supported formats: JPG, PNG (Ensure face is clearly visible)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>User Guide</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-zinc-400 text-sm">
            Follow these 3 simple steps to find and download your race photos quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative flex flex-col justify-between group hover:border-amber-500/50 transition">
            <div className="absolute -top-4 left-6 bg-amber-500 text-black font-black text-xs w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              01
            </div>
            <div className="space-y-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Choose Search Method</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You can enter your <strong className="text-white">BIB Number</strong> in the main search bar, or use the <strong className="text-white">AI Selfie Search</strong> feature by uploading a clear photo of your face.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative flex flex-col justify-between group hover:border-amber-500/50 transition">
            <div className="absolute -top-4 left-6 bg-amber-500 text-black font-black text-xs w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              02
            </div>
            <div className="space-y-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">AI Photo Matching</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Our artificial intelligence (AI) system scans thousands of event photos within seconds to instantly locate and match your pictures.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative flex flex-col justify-between group hover:border-amber-500/50 transition">
            <div className="absolute -top-4 left-6 bg-amber-500 text-black font-black text-xs w-8 h-8 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              03
            </div>
            <div className="space-y-3 mt-2">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Select & Download</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Choose your favorite photos from the search results displayed and easily download or purchase them right away.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-amber-500 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Frequently Asked Questions (FAQ)
            </div>
            <h4 className="text-lg font-bold text-white">Do users need to create an account to search for photos?</h4>
            <p className="text-xs text-zinc-400 max-w-2xl">
              <strong className="text-white">No account needed!</strong> You can search for your photos instantly using your BIB number or selfie for free without any hassle or registration required.
            </p>
          </div>
          <a
            href="#contact"
            className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs px-6 py-3 rounded-xl transition shrink-0 shadow-lg shadow-amber-500/10 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" /> Contact Support
          </a>
        </div>
      </section>

      {/* ALBUMS GALLERY */}
      <section id="albums" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Event Albums
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Select your running event to view full galleries.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredAlbums.map((album) => (
            <div 
              key={album.id} 
              className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden hover:border-zinc-700 transition group flex flex-col justify-between"
            >
              <div className="relative h-48 overflow-hidden bg-zinc-900">
                <img 
                  src={album.coverUrl} 
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                {album.badge && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-black font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md">
                    {album.badge}
                  </span>
                )}
                <span className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md text-zinc-300 text-[10px] font-medium px-2.5 py-1 rounded-md border border-zinc-800 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-amber-500" /> {album.photoCount} Photos
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
                    {album.title}
                  </h3>
                  <div className="flex flex-col gap-1 text-xs text-zinc-400 mt-2">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" /> {album.date}
                    </span>
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" /> {album.location}
                    </span>
                  </div>
                </div>

                <Link 
                  href={`/album/${album.id}`}
                  className="w-full bg-zinc-900 hover:bg-amber-500 hover:text-black text-zinc-300 font-bold text-xs py-2.5 rounded-xl border border-zinc-800 transition flex items-center justify-center gap-2"
                >
                  <span>View Gallery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section id="contact" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-amber-500 text-xs font-medium">
            <Mail className="w-3.5 h-3.5" />
            <span>Get in Touch</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Us via WhatsApp
          </h2>
          <p className="text-zinc-400 text-sm">
            Fill in your details below. Clicking submit will open WhatsApp directly to reach us, or you can email us at <strong className="text-white">sarawakpixelphotography@gmail.com</strong>
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nama */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-500" /> Your Name
                </label>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Ahmad bin Ali"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
                  required
                />
              </div>

              {/* No Bill / References / BIB */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-500" /> Reference / BIB No.
                </label>
                <input
                  type="text"
                  value={contactRef}
                  onChange={(e) => setContactRef(e.target.value)}
                  placeholder="e.g. BIB #8821 or Order #1042"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {/* No WhatsApp */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-500" /> WhatsApp Number
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="e.g. 0123456789"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition"
                required
              />
            </div>

            {/* Mesej */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-500" /> Your Message / Issue
              </label>
              <textarea
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                rows={4}
                placeholder="Describe your inquiry, missing photos, or payment questions here..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition resize-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-3.5 rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Send Inquiry via WhatsApp</span>
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-zinc-900 py-10 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-amber-500 w-6 h-6 rounded flex items-center justify-center font-black text-black text-xs">
              PS
            </div>
            <span className="font-bold text-white">PIXELSHOOT</span>
            <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#albums" className="hover:text-zinc-300 transition">Albums</a>
            <a href="#how-it-works" className="hover:text-zinc-300 transition">How It Works</a>
            <a href="#contact" className="hover:text-amber-500 transition flex items-center gap-1">
              <Mail className="w-3 h-3 text-amber-500" /> Contact Us
            </a>
            <Link href="/login" className="hover:text-amber-500 transition">Admin Portal</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}