'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import Image from 'next/image';
import cs2Logo from '@/assets/cs2.webp';
import {
  CreditCard,
  Coins,
  Check,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

declare global {
  interface Window {
    Billgang: any;
  }
}

const BILLGANG_DOMAIN = 'https://sagitarius.bgng.io';

const pricingOptions = [
  {
    id: '7-days',
    name: '7 Days',
    description: 'Perfect for testing our software features.',
    price: '4.99',
    features: [
      'Full Access for 7 Days',
      'Instant Key Delivery',
      'UNDETECTED',
    ],
    highlight: false,
    billgangPath: 'CS2-7-days'
  },
  {
    id: '1-month',
    name: '1 Month',
    description: 'Most popular choice for gamers.',
    price: '14.99',
    features: [
      'Full Access for 30 Days',
      'Instant Key Delivery',
      'UNDETECTED',
    ],
    highlight: true,
    billgangPath: 'CS2-1-month'
  },
  {
    id: '3-months',
    name: '3 Months',
    description: 'Best value for long-term reliability.',
    price: '34.99',
    features: [
      'Full Access for 90 Days',
      'Instant Key Delivery',
      'UNDETECTED',
    ],
    highlight: false,
    billgangPath: 'CS2-3-months'
  }
];

export default function GetKeyManager() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await createClient().auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    // Manually create the Billgang container if it's not there,
    // because the script's DOMContentLoaded listener might not fire in a SPA.
    if (typeof document !== 'undefined' && !document.getElementById('billgang-container')) {
      const container = document.createElement('div');
      container.id = 'billgang-container';
      document.body.appendChild(container);
    }
  }, []);

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyResult(null);
    try {
      const res = await fetch('/api/payments/verify');
      const data = await res.json();
      if (data.success) {
        setVerifyResult(`Success! Found ${data.newly_added} new key(s) in your Inbox.`);
      } else {
        setVerifyResult(data.message || 'No new payments found.');
      }
    } catch (err) {
      setVerifyResult('Error checking payments.');
    } finally {
      setVerifying(false);
    }
  };

  const initiatePurchase = (plan: any) => {
    setSelectedPlan(plan);
    const productPath = plan.billgangPath;
    const domain = BILLGANG_DOMAIN.includes('https://') ? BILLGANG_DOMAIN : `https://${BILLGANG_DOMAIN}`;

    console.log('Manually triggering Billgang embed for:', productPath);

    let container = document.getElementById('billgang-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'billgang-container';
      document.body.appendChild(container);
    }

    const existing = document.getElementById('billgang-embed-' + productPath);
    if (existing) existing.remove();

    document.body.style.overflow = 'hidden';
    const modal = document.createElement('div');
    modal.id = 'billgang-embed-' + productPath;
    modal.style.position = 'fixed';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.zIndex = '999999';
    modal.style.top = '0';
    modal.style.left = '0';

    const modalBackdrop = document.createElement('div');
    modalBackdrop.style.position = 'absolute';
    modalBackdrop.style.width = '100%';
    modalBackdrop.style.height = '100%';
    modalBackdrop.style.background = 'rgba(0, 0, 0, 0.8)';
    modalBackdrop.style.backdropFilter = 'blur(8px)';
    modalBackdrop.onclick = () => {
      modal.remove();
      document.body.style.overflow = 'auto';
    };
    modal.appendChild(modalBackdrop);

    const iframeWrapper = document.createElement('div');
    iframeWrapper.style.position = 'absolute';
    iframeWrapper.style.width = '100%';
    iframeWrapper.style.height = '100%';
    iframeWrapper.style.display = 'flex';
    iframeWrapper.style.alignItems = 'center';
    iframeWrapper.style.justifyContent = 'center';
    iframeWrapper.style.zIndex = '1';
    iframeWrapper.style.pointerEvents = 'none';

    const iframeContainer = document.createElement('div');
    iframeContainer.style.width = '90%';
    iframeContainer.style.maxWidth = '500px';
    iframeContainer.style.height = '90%';
    iframeContainer.style.maxHeight = '700px';
    iframeContainer.style.backgroundColor = '#0a0a0a';
    iframeContainer.style.borderRadius = '24px';
    iframeContainer.style.overflow = 'hidden';
    iframeContainer.style.pointerEvents = 'auto';
    iframeContainer.style.border = '1px solid rgba(255,255,255,0.1)';
    iframeContainer.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';

    const loader = document.createElement('div');
    loader.style.position = 'absolute';
    loader.style.inset = '0';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.background = '#0a0a0a';
    loader.innerHTML = `<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>`;
    iframeContainer.appendChild(loader);

    const iframe = document.createElement('iframe');
    iframe.src = `${domain}/embed/${productPath}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.onload = () => loader.remove();

    iframeContainer.appendChild(iframe);
    iframeWrapper.appendChild(iframeContainer);
    modal.appendChild(iframeWrapper);
    container.appendChild(modal);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4 px-6">
      <Script 
        src="https://platform.billgang.com/embed.js" 
        strategy="afterInteractive"
      />
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-[10px] uppercase font-bold tracking-widest">
          <Zap size={12} fill="currentColor" />
          Premium Access
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--accent-gold)]">Access Key</span>
        </h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
          Unlock instant access to Sagitarius private software. Secure, anonymous, and high-performance.
        </p>

        <div className="pt-4">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[var(--accent)]/30 text-[11px] font-bold text-white uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(197,160,89,0.05)] active:scale-95"
          >
            {verifying ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} className="text-[var(--accent)]" />}
            Verify My Purchase
          </button>
          {verifyResult && (
            <p className="mt-3 text-[10px] text-[var(--accent)] font-bold uppercase tracking-widest animate-pulse">
              {verifyResult}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingOptions.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-[2.5rem] border transition-all duration-500 p-8 group ${plan.highlight
                ? 'bg-gradient-to-b from-white/[0.05] to-white/[0.02] border-[var(--accent)]/30 shadow-[0_20px_50px_rgba(197,160,89,0.1)]'
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
              }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[var(--accent)] text-black text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Best Value
              </div>
            )}

            <div className="space-y-1 mb-8">
              <div className="flex items-center gap-3">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={cs2Logo} alt="CS2" fill className="object-contain" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
              </div>
              <p className="text-xs text-white/30">{plan.description}</p>
            </div>

            <div className="mb-8 relative">
              <div className="flex items-baseline gap-1 font-sans">
                <span className="text-2xl font-bold text-white/40">€</span>
                <span className="text-5xl font-extrabold text-white tracking-tight tabular-nums">{plan.price.split('.')[0]}</span>
                <span className="text-xl font-bold text-white/40 tabular-nums">.{plan.price.split('.')[1]}</span>
              </div>
            </div>

            <div className="space-y-4 mb-10 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 h-4 w-4 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                    <Check size={10} className="text-green-500" />
                  </div>
                  <span className="text-[12px] text-white/60">{feature}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <button
                onClick={() => initiatePurchase(plan)}
                className={`w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${plan.highlight
                    ? 'bg-white text-black hover:bg-white/90 shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:-translate-y-1'
                    : 'bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] hover:-translate-y-1'
                  }`}
              >
                Purchase Now
                <ChevronRight size={14} />
              </button>

              <p className="text-[9px] text-white/10 text-center uppercase tracking-widest font-bold">
                * Keys are delivered to your Inbox instantly
              </p>

              <div className="flex items-center justify-center gap-4 text-[10px] text-white/20 font-bold uppercase tracking-widest py-2">
                <div className="flex items-center gap-1.5">
                  <Coins size={12} /> Crypto Only
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 pb-12">
        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.04] flex items-start gap-6">
          <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 text-blue-400">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Secure Transactions</h4>
            <p className="text-sm text-white/30 leading-relaxed mb-4">
              All payments are processed through encrypted channels. We accept Bitcoin, Ethereum, and Litecoin via Billgang.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/support"
                className="text-[10px] font-bold text-[var(--accent)] hover:text-[var(--accent-gold)] uppercase tracking-widest transition-all"
              >
                Support Center
              </Link>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <Link 
                href="/dashboard/policies"
                className="text-[10px] font-bold text-white/20 hover:text-white/40 uppercase tracking-widest transition-all"
              >
                View Policies
              </Link>
            </div>
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.04] flex items-start gap-6">
          <div className="h-14 w-14 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center flex-shrink-0 text-[var(--accent)]">
            <Globe size={28} />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-2">Instant Key Delivery</h4>
            <p className="text-sm text-white/30 leading-relaxed">
              Your activation key will be delivered automatically to your dashboard <b>Inbox</b> immediately after payment confirmation.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="fixed bottom-10 right-10 z-[100] p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <AlertCircle size={18} />
          <span className="text-sm font-bold">{error}</span>
          <button onClick={() => setError(null)} className="ml-2 hover:text-white"><X size={14} /></button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={40} className="text-[var(--accent)] animate-spin" />
            <p className="text-sm font-black text-white uppercase tracking-widest">Initializing Secure Checkout...</p>
          </div>
        </div>
      )}
    </div>
  );
}
