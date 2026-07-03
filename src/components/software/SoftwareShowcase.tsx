'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Cpu,
  Download,
  Gauge,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import LoaderScene from './LoaderScene';

const metrics = [
  { label: 'Bootstrap', value: '< 1s', icon: Zap },
  { label: 'Binary', value: 'Native', icon: Cpu },
  { label: 'Access', value: 'HWID', icon: LockKeyhole },
];

const pipeline = [
  { title: 'Authenticate', body: 'Login, license state, role access, and HWID are validated before any package is served.', icon: KeyRound },
  { title: 'Resolve', body: 'The API returns a short lived authorized download endpoint for the correct loader build.', icon: Terminal },
  { title: 'Deliver', body: 'The client downloads only what the account is allowed to receive, with no cache trail.', icon: Download },
];

const featureRows = [
  ['Native bootstrapper', 'WinHTTP client, low overhead, no heavy runtime on the user machine.'],
  ['Account bound access', 'License keys, roles, expiry, and machine binding flow through the existing dashboard API.'],
  ['Fast surface', 'Static presentation route, lazy 3D scene, reduced motion support, and small DOM.'],
  ['Ready to extend', 'Version manifest endpoints are already in place for updates and release notes.'],
];

export default function SoftwareShowcase() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#030607] text-white selection:bg-[var(--accent)]/20">
      <LoaderScene />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/[0.03] text-[13px] font-black text-[var(--accent)]">
              S
            </span>
            <span className="text-[11px] font-black uppercase tracking-[0.35em] text-white/70">
              Software
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <a href="#pipeline" className="software-nav-link">Pipeline</a>
            <a href="#access" className="software-nav-link">Access</a>
            <Link href="/dashboard/software" className="software-nav-link text-[var(--accent)]">
              Dashboard
            </Link>
          </nav>
        </header>

        <section className="mx-auto grid min-h-[calc(100vh-76px)] w-full max-w-7xl grid-cols-1 items-center gap-8 px-5 pb-12 pt-8 sm:px-8 lg:grid-cols-[minmax(0,0.82fr)_420px] xl:grid-cols-[minmax(0,0.92fr)_minmax(420px,0.58fr)]">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[var(--accent)]/20 bg-[var(--accent)]/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[var(--accent)]">
              <Sparkles size={13} />
              Private loader interface
            </div>

            <h1 className="max-w-[760px] text-[clamp(46px,6.4vw,86px)] font-black uppercase leading-[0.92] tracking-normal 2xl:text-[clamp(54px,7.3vw,108px)]">
              Sagitarius
              <span className="block bg-gradient-to-r from-[var(--accent)] via-white to-[#fb7185] bg-clip-text text-transparent">
                Loader
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/56 sm:text-lg">
              A clean native bootstrapper presentation built for fast access, account-bound delivery,
              and a software flow that feels sharp before the download even starts.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard/software"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 text-sm font-black uppercase tracking-[0.16em] text-[#021013] transition-transform hover:translate-y-[-1px]"
              >
                Open downloads
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-5 text-sm font-bold uppercase tracking-[0.16em] text-white/70 transition-colors hover:border-white/20 hover:text-white"
              >
                Member login
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-2">
              {metrics.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-md border border-white/[0.06] bg-black/20 p-3 backdrop-blur-sm">
                  <Icon size={15} className="mb-3 text-[var(--accent)]" />
                  <div className="text-lg font-black text-white">{value}</div>
                  <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/32">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="justify-self-end rounded-md border border-white/[0.07] bg-[#061012]/76 p-4 shadow-2xl backdrop-blur-xl lg:w-full">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/34">Live state</p>
                <h2 className="mt-1 text-xl font-black text-white">Loader Core</h2>
              </div>
              <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-300">
                Online
              </div>
            </div>

            <div className="space-y-3 py-4">
              {featureRows.map(([name, body]) => (
                <div key={name} className="grid grid-cols-[112px_1fr] gap-3 rounded-md border border-white/[0.05] bg-white/[0.025] p-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--accent)]">{name}</span>
                  <span className="text-xs leading-5 text-white/48">{body}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-md border border-[#fb7185]/18 bg-[#fb7185]/7 p-3">
              <ShieldCheck size={18} className="shrink-0 text-[#fb7185]" />
              <p className="text-xs leading-5 text-white/52">
                Delivery stays behind the authenticated dashboard and loader API. The presentation page stays static.
              </p>
            </div>
          </aside>
        </section>

        <section id="pipeline" className="relative border-t border-white/[0.06] bg-[#061012]/72 px-5 py-16 backdrop-blur-xl sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[var(--accent)]">Pipeline</p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-normal text-white sm:text-5xl">
                  From account to binary
                </h2>
              </div>
              <p className="max-w-md text-sm leading-6 text-white/45">
                Three steps, one clean path. No page weight is added until the visual scene is mounted.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {pipeline.map(({ title, body, icon: Icon }, index) => (
                <div key={title} className="rounded-md border border-white/[0.07] bg-black/22 p-5">
                  <div className="mb-8 flex items-center justify-between">
                    <Icon className="text-[var(--accent)]" size={22} />
                    <span className="text-[10px] font-black text-white/22">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/45">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="access" className="border-t border-white/[0.06] px-5 py-12 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#fb7185]">Ready</p>
              <h2 className="mt-2 text-2xl font-black uppercase text-white sm:text-4xl">Access the dashboard build</h2>
            </div>
            <Link
              href="/dashboard/software"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-white px-5 text-sm font-black uppercase tracking-[0.16em] text-black transition-transform hover:translate-y-[-1px]"
            >
              Continue
              <Gauge size={16} />
            </Link>
          </div>
        </section>
      </div>

      <style jsx>{`
        .software-nav-link {
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.025);
          padding: 0.65rem 0.85rem;
          color: rgba(255, 255, 255, 0.48);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: border-color 180ms ease, color 180ms ease, background 180ms ease;
        }

        .software-nav-link:hover {
          border-color: rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.055);
          color: white;
        }
      `}</style>
    </main>
  );
}
