'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FEATURES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: 'Execution Instantan\u00e9e',
    desc: 'Injection Lua ultra-rapide avec r\u00e9solution automatique d\u2019\u00e9tat. Z\u00e9ro freeze, z\u00e9ro crash.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Anti-D\u00e9tection Avanc\u00e9',
    desc: 'Bypass des protections Byfron et Hyperion. Mise \u00e0 jour continue pour rester devant.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
    title: 'Mises \u00e0 Jour Automatiques',
    desc: 'Chaque mise \u00e0 jour Roblox est couverte en moins de 24h. Aucune intervention requise.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Interface Multi-Instance',
    desc: 'Lancer plusieurs instances Roblox simultan\u00e9ment. D\u00e9compil\u00e9eur et script hub int\u00e9gr\u00e9s.',
  },
];

export default function TalmorPage() {
  const [scrolled, setScrolled] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (authOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [authOpen]);

  return (
    <main className="relative min-h-screen bg-[#0a0a0c] text-white overflow-hidden" style={{ fontFamily: 'var(--font-ui, Inter, system-ui, sans-serif)' }}>
      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(138,43,226,0.06) 0%, transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.04) 0%, transparent 60%)', filter: 'blur(80px)' }} />
      </div>

      {/* ─── NAVBAR ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/[0.04]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <Link href="/talmor" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-[#8a2be2] to-[#00e5ff] flex items-center justify-center shadow-lg shadow-[#8a2be2]/20 group-hover:shadow-[#8a2be2]/40 transition-shadow duration-300">
              <span className="text-white font-black text-sm tracking-tight">T</span>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-white/90">Talmor</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] font-medium text-white/40 hover:text-white/90 transition-colors duration-300">
              Fonctionnalit\u00e9s
            </a>
            <a href="#status" className="text-[13px] font-medium text-white/40 hover:text-white/90 transition-colors duration-300">
              Statut
            </a>
          </div>

          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => { setAuthTab('login'); setAuthOpen(true); }}
              className="text-[12px] font-semibold tracking-wide text-white/60 hover:text-white px-4 py-2 rounded-lg border border-white/[0.06] hover:border-[#8a2be2]/30 bg-white/[0.02] hover:bg-[#8a2be2]/5 transition-all duration-300"
            >
              Connexion
            </button>
            <a
              href="https://discord.gg/sagitarius"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-semibold tracking-wide text-white px-4 py-2 rounded-lg bg-gradient-to-r from-[#8a2be2] to-[#6c3ac7] hover:from-[#9b4dff] hover:to-[#7d4dd4] shadow-lg shadow-[#8a2be2]/20 hover:shadow-[#8a2be2]/40 transition-all duration-300"
            >
              Discord
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[4.5px]' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[1.5px] bg-white/60 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[4.5px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/[0.04] px-6 py-6 flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-white/60 hover:text-white transition-colors">Fonctionnalit\u00e9s</a>
            <a href="#status" onClick={() => setMobileMenuOpen(false)} className="text-[14px] text-white/60 hover:text-white transition-colors">Statut</a>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setAuthTab('login'); setAuthOpen(true); setMobileMenuOpen(false); }} className="flex-1 text-[13px] font-semibold py-2.5 rounded-lg border border-white/[0.06] text-white/70 hover:text-white hover:border-[#8a2be2]/30 transition-all duration-300">Connexion</button>
              <a href="https://discord.gg/sagitarius" target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-[13px] font-semibold py-2.5 rounded-lg bg-[#8a2be2] text-white">Discord</a>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ─── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[92vh] px-6 text-center">
        {/* Badge */}
        <div className="mb-8 animate-reveal-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8a2be2]/20 bg-[#8a2be2]/[0.06] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#8a2be2] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8a2be2]" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#8a2be2]/90">v1.0 Disponible</span>
          </div>
        </div>

        {/* Title */}
        <h1
          className="text-[clamp(42px,8vw,96px)] font-black leading-[0.95] tracking-tight mb-8 animate-reveal-2"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          L&apos;ex\u00e9cuteur ultime<br />
          <span style={{
            background: 'linear-gradient(90deg, #8a2be2, #00e5ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            de scripts
          </span>, r\u00e9invent\u00e9.
        </h1>

        {/* Subtitle */}
        <p className="max-w-lg text-[clamp(14px,2vw,17px)] leading-relaxed text-white/40 mb-12 animate-reveal-3">
          Vitesse brute. Stabilit\u00e9 absolue. Talmor r\u00e9\u00e9crit les r\u00e8gles de l&apos;\u00e9x\u00e9cution Lua sur Roblox \u2014 con\u00e7u pour les joueurs qui ne font aucun compromis.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 animate-reveal-4">
          <a
            href="#download"
            className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-[14px] font-bold tracking-wide text-white bg-gradient-to-r from-[#8a2be2] to-[#7040d0] shadow-xl shadow-[#8a2be2]/25 hover:shadow-[#8a2be2]/45 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Acc\u00e9der au Logiciel
          </a>
          <a
            href="https://discord.gg/sagitarius"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl text-[14px] font-bold tracking-wide text-white/70 border border-white/[0.08] hover:border-white/[0.15] hover:text-white hover:bg-white/[0.03] transition-all duration-300"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 10l5.5 5.5" /><circle cx="17.5" cy="12.5" r="5.5" />
              <path d="M4 4l5.5 5.5" /><circle cx="6.5" cy="12.5" r="5.5" />
            </svg>
            Rejoindre la Communaut\u00e9
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-reveal-4">
          <div className="w-5 h-8 rounded-full border border-white/10 flex justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-white/20" style={{ animation: 'scrollBounce 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#8a2be2]/80 mb-4">Technologie</p>
            <h2 className="text-[clamp(28px,5vw,48px)] font-bold tracking-tight text-white/90">
              Pourquoi <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a2be2] to-[#00e5ff]">Talmor</span> ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-white/[0.04] bg-white/[0.015] p-7 hover:border-[#8a2be2]/20 hover:bg-[#8a2be2]/[0.02] transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(138,43,226,0.04), transparent 40%)' }} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#8a2be2]/10 border border-[#8a2be2]/10 flex items-center justify-center text-[#8a2be2]/80 mb-5 group-hover:text-[#8a2be2] group-hover:border-[#8a2be2]/25 group-hover:bg-[#8a2be2]/15 transition-all duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-[16px] font-bold text-white/90 mb-2">{f.title}</h3>
                  <p className="text-[14px] leading-relaxed text-white/35">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATUS ─── */}
      <section id="status" className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-white/[0.04] bg-white/[0.015] p-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#8a2be2]/[0.02] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/30 mb-6">\u00c9tat du service</p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                </span>
                <span className="text-[17px] font-bold text-emerald-400">Op\u00e9rationnel</span>
              </div>
              <p className="text-[13px] text-white/30">Tous les syst\u00e8mes fonctionnent normalement. Derni\u00e8re v\u00e9rification : il y a 2 min.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="relative z-10 border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#8a2be2] to-[#00e5ff] flex items-center justify-center">
              <span className="text-white font-black text-[10px]">T</span>
            </div>
            <span className="text-[12px] font-bold text-white/40">Talmor</span>
            <span className="text-[11px] text-white/15 ml-1">&copy; 2026 Sagitarius</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://discord.gg/sagitarius" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/25 hover:text-white/60 transition-colors duration-300">Discord</a>
            <Link href="/" className="text-[12px] text-white/25 hover:text-white/60 transition-colors duration-300">Sagitarius</Link>
          </div>
        </div>
      </footer>

      {/* ─── AUTH MODAL ─── */}
      {authOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setAuthOpen(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          {/* Modal */}
          <div ref={modalRef} className="relative w-full max-w-[400px] rounded-2xl border border-white/[0.06] bg-[#111114]/95 backdrop-blur-xl shadow-2xl shadow-black/60 animate-reveal-2">
            {/* Close */}
            <button
              onClick={() => setAuthOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Tabs */}
            <div className="flex border-b border-white/[0.04]">
              <button
                onClick={() => setAuthTab('login')}
                className={`flex-1 py-4 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                  authTab === 'login'
                    ? 'text-white border-b-2 border-[#8a2be2]'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setAuthTab('register')}
                className={`flex-1 py-4 text-[13px] font-semibold tracking-wide transition-all duration-300 ${
                  authTab === 'register'
                    ? 'text-white border-b-2 border-[#8a2be2]'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                Inscription
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              {authTab === 'login' ? (
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/30 mb-2">Nom d&apos;utilisateur</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder-white/20 outline-none focus:border-[#8a2be2]/40 focus:bg-[#8a2be2]/[0.03] transition-all duration-300"
                      placeholder="votre pseudo"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/30 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder-white/20 outline-none focus:border-[#8a2be2]/40 focus:bg-[#8a2be2]/[0.03] transition-all duration-300"
                      placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    />
                  </div>
                  <button className="mt-2 w-full py-3 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-[#8a2be2] to-[#7040d0] shadow-lg shadow-[#8a2be2]/20 hover:shadow-[#8a2be2]/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                    Se connecter
                  </button>
                </form>
              ) : (
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/30 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder-white/20 outline-none focus:border-[#8a2be2]/40 focus:bg-[#8a2be2]/[0.03] transition-all duration-300"
                      placeholder="vous@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/30 mb-2">Mot de passe</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder-white/20 outline-none focus:border-[#8a2be2]/40 focus:bg-[#8a2be2]/[0.03] transition-all duration-300"
                      placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-wider uppercase text-white/30 mb-2">Code d&apos;invitation</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-[14px] placeholder-white/20 outline-none focus:border-[#8a2be2]/40 focus:bg-[#8a2be2]/[0.03] transition-all duration-300 font-mono text-[13px]"
                      placeholder="SAG-XXXX-XXXX"
                    />
                    <p className="mt-2 text-[11px] leading-relaxed text-white/20">
                      L&apos;inscription est r\u00e9serv\u00e9e aux revendeurs officiels et partenaires. Si vous \u00eates un utilisateur standard, veuillez passer par notre boutique externe.
                    </p>
                  </div>
                  <button className="mt-1 w-full py-3 rounded-xl text-[14px] font-bold text-white bg-gradient-to-r from-[#8a2be2] to-[#7040d0] shadow-lg shadow-[#8a2be2]/20 hover:shadow-[#8a2be2]/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300">
                    Cr\u00e9er un compte
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(4px); opacity: 1; }
        }
      ` }} />
    </main>
  );
}
