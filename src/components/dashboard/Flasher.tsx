'use client';

import React from 'react';

export default function Flasher() {
  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <div className="flex flex-col items-center gap-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#666]">
          GHOST FIRMWARE FLASHER
        </p>
        <div className="h-px w-[200px] overflow-hidden bg-gradient-to-r from-transparent via-[#333] to-transparent" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#444]">
          M5STICKC PLUS / ESP32-S3
        </p>
      </div>

      <div className="flex flex-col items-center gap-6 p-10 border border-white/5 bg-white/[0.02] rounded-2xl backdrop-blur-3xl shadow-2xl">
        <div className="flex flex-col items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mb-2" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-white/60">Ready to flash</p>
        </div>

        <esp-web-install-button manifest="/firmware/manifest.json">
          <button 
            slot="activate" 
            className="group relative px-8 py-4 bg-white text-black font-mono text-xs uppercase tracking-[0.2em] font-bold rounded-full hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            FLASHER MAINTENANT
          </button>
          <div slot="unsupported" className="text-red-500 font-mono text-[10px] uppercase tracking-widest">
            Navigateur non supporté (Utilisez Chrome/Edge)
          </div>
        </esp-web-install-button>

        <div className="flex flex-col gap-2 items-center text-center max-w-[280px]">
          <p className="font-mono text-[9px] uppercase tracking-tight text-white/30 leading-relaxed">
            Assurez-vous que votre appareil est branché en USB et que les drivers sont installés.
          </p>
        </div>
      </div>
    </div>
  );
}
