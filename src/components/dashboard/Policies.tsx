'use client';

import React from 'react';
import { Shield, FileText, AlertCircle, Scale, Lock, RefreshCcw } from 'lucide-react';

export default function Policies() {
  const sections = [
    {
      title: 'Terms of Service',
      icon: Scale,
      content: `By accessing Sagitarius.cc, you agree to be bound by these terms. Our software is provided "as is" without any warranties. We reserve the right to terminate access for any user found violating our community guidelines or attempting to reverse engineer our products. Our services are intended for educational and personal use only. Use at your own risk.`
    },
    {
      title: 'Refund Policy',
      icon: RefreshCcw,
      content: `Due to the nature of digital goods and the immediate delivery of license keys, all sales are final. We do not offer refunds once a key has been generated or accessed. If you experience technical issues, our support team is available 24/7 to assist with installation and troubleshooting. Compensation may be provided in the form of time-extensions at our sole discretion.`
    },
    {
      title: 'Privacy Policy',
      icon: Lock,
      content: `We value your privacy. We only collect essential information required for authentication and license management (Email and HWID). We do not share your data with third parties. Your payment information is processed exclusively by our payment providers (Billgang) and is never stored on our servers. HWID data is encrypted and used only for security purposes.`
    },
    {
      title: 'Software Disclaimer',
      icon: AlertCircle,
      content: `Sagitarius.cc is not responsible for any account restrictions, bans, or losses incurred while using our software. We strive for maximum security, but no software is 100% undetectable. You acknowledge the risks associated with third-party software and assume full responsibility for your actions.`
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] uppercase font-bold tracking-widest">
          <Shield size={12} className="text-[var(--accent)]" />
          Legal center
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Legal & Policies</h1>
        <p className="text-sm text-white/40 max-w-lg mx-auto leading-relaxed">
          Please review our terms carefully. By using our services, you acknowledge and agree to the following policies.
        </p>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <div 
            key={idx} 
            className="group p-8 rounded-[2rem] bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 transition-transform duration-500">
                <section.icon size={22} />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">{section.title}</h2>
            </div>
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="p-8 rounded-[2rem] bg-[var(--accent)]/5 border border-[var(--accent)]/10 text-center">
        <p className="text-[11px] text-[var(--accent)]/80 uppercase tracking-[0.2em] font-bold">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-xs text-white/30 mt-3 leading-relaxed max-w-md mx-auto">
          We reserve the right to update these policies at any time. Significant changes will be announced via our community channels.
        </p>
      </div>
    </div>
  );
}
