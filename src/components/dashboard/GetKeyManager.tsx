'use client';

import { useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import faceitLogo from '@/assets/faceit.jpg';
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
  Package,
  X
} from 'lucide-react';

declare global {
  interface Window {
    sellAuthEmbed: {
      checkout: (config: {
        shopId: number | string;
        productId: number | string;
        variantId?: number | string;
      }) => void;
    };
  }
}

const pricingOptions = [
  {
    id: '7-days',
    name: '7 Days',
    price: '12.00',
    description: 'Perfect for testing our software features.',
    features: [
      'Full Access for 7 Days',
      'Instant Key Delivery',
      'UNDETECTED',
    ],
    highlight: false,
    sellAuth: {
      faceit: { productId: 653923, variantId: 1030917 },
      external: { productId: 653938, variantId: 1030944 }
    }
  },
  {
    id: '1-month',
    name: '1 Month',
    price: '34.99',
    description: 'Most popular choice for gamers.',
    features: [
      'Full Access for 30 Days',
      'Instant Key Delivery',
      'UNDETECTED',
    ],
    highlight: true,
    sellAuth: {
      faceit: { productId: 653928, variantId: 1030922 },
      external: { productId: 653942, variantId: 1030948 }
    }
  },
  {
    id: '3-months',
    name: '3 Months',
    price: '79.99',
    description: 'Best value for long-term reliability.',
    features: [
      'Full Access for 90 Days',
      'Instant Key Delivery',
      'UNDETECTED',
    ],
    highlight: false,
    sellAuth: {
      faceit: { productId: 653933, variantId: 1030931 },
      external: { productId: 653944, variantId: 1030957 }
    }
  }
];

export default function GetKeyManager() {
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<string | null>(null);

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
    setShowCategorySelector(true);
  };

  const handleFinalPurchase = (category: 'faceit' | 'external') => {
    const config = selectedPlan.sellAuth[category];
    console.log('Final Purchase Triggered:', { category, config, hasEmbed: !!window.sellAuthEmbed });

    if (config) {
      if (window.sellAuthEmbed) {
        window.sellAuthEmbed.checkout({
          shopId: 224106,
          productId: config.productId,
          variantId: config.variantId
        });
      } else {
        // Fallback to direct URL if embed script is not loaded
        console.warn('SellAuth Embed not found, falling back to direct URL');
        const slug = category === 'faceit' 
          ? `faceit-${selectedPlan.id}` 
          : `cs2-external-${selectedPlan.id}`;
        window.open(`https://buy-on-sagitarius.mysellauth.com/product/${slug}`, '_blank');
      }
    }
    setShowCategorySelector(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-4 px-6">
      <Script src="https://sellauth.com/static/js/embed.js" strategy="afterInteractive" />
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] uppercase font-bold tracking-widest">
          <Zap size={12} fill="currentColor" />
          Premium Access
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Get Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500">Access Key</span>
        </h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed">
          Unlock instant access to Sagitarius private software. Secure, anonymous, and high-performance.
        </p>

        <div className="pt-4">
          <button 
            onClick={handleVerify}
            disabled={verifying}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-bold text-white uppercase tracking-widest transition-all"
          >
            {verifying ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            Verify My Purchase
          </button>
          {verifyResult && (
            <p className="mt-3 text-[10px] text-orange-400 font-bold uppercase tracking-widest animate-pulse">
              {verifyResult}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingOptions.map((plan) => (
          <div 
            key={plan.id}
            className={`relative flex flex-col rounded-[2.5rem] border transition-all duration-500 p-8 group ${
              plan.highlight 
                ? 'bg-gradient-to-b from-white/[0.05] to-white/[0.02] border-orange-500/30 shadow-[0_20px_50px_rgba(249,115,22,0.1)]' 
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg">
                Best Value
              </div>
            )}

            <div className="space-y-1 mb-8">
              <h3 className="text-xl font-bold text-white tracking-tight">{plan.name}</h3>
              <p className="text-xs text-white/30">{plan.description}</p>
            </div>

            <div className="mb-8 relative">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white/40">€</span>
                <span className="text-5xl font-black text-white tracking-tighter">{plan.price.split('.')[0]}</span>
                <span className="text-xl font-bold text-white/40">.{plan.price.split('.')[1]}</span>
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
                className={`w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 ${
                  plan.highlight
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
            <p className="text-sm text-white/30 leading-relaxed">
              All payments are processed through encrypted channels. We accept Bitcoin, Ethereum, and Litecoin via SellAuth.
            </p>
          </div>
        </div>
        <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.04] flex items-start gap-6">
          <div className="h-14 w-14 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 text-orange-400">
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

      {/* Category Selection Modal */}
      {showCategorySelector && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative w-full max-w-xl bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
            <div className="absolute top-6 right-6">
              <button 
                onClick={() => setShowCategorySelector(false)}
                className="p-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="text-center mb-10 space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight uppercase tracking-widest">Select Version</h2>
              <p className="text-sm text-white/40">Choose the version for your {selectedPlan.name} access</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => handleFinalPurchase('faceit')}
                className="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-500 h-[220px]"
              >
                <div className="relative h-20 w-32 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110">
                  <Image 
                    src={faceitLogo} 
                    alt="Faceit" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">Faceit Client</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Premium Protection</p>
                </div>
              </button>

              <button 
                onClick={() => handleFinalPurchase('external')}
                className="group relative flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-blue-500/30 transition-all duration-500 h-[220px]"
              >
                <div className="relative h-20 w-32 grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110">
                  <Image 
                    src={cs2Logo} 
                    alt="CS2" 
                    fill 
                    className="object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white uppercase tracking-widest">CS2 External</p>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">High Performance</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
