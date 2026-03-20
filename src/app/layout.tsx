import type { Metadata } from 'next';
import Script from 'next/script';
import TopGradientBar from '@/components/TopGradientBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sagitarius.cc | Precision Software',
  description: 'Premium counter-strike software. Join the elite.',
  metadataBase: new URL('https://sagitarius.cc'),
  openGraph: {
    title: 'Sagitarius.cc',
    description: 'Precision built. Elite performance.',
    url: 'https://sagitarius.cc',
    siteName: 'Sagitarius',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sagitarius.cc Banner',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sagitarius.cc',
    description: 'Elite gaming software.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export const viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopGradientBar />
        {children}
        <Script
          type="module"
          src="https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module"
          strategy="afterInteractive"
        />
        <Script src="https://embed.billgang.store/embed.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
