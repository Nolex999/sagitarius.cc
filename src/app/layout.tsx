import type { Metadata } from 'next';
import TopGradientBar from '@/components/TopGradientBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sagitarius.cc | Private Software',
  description: 'Private software. Join the elite.',
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
  themeColor: '#C5A059',
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
      <body className="antialiased">
        <TopGradientBar />
        {children}
      </body>
    </html>
  );
}
