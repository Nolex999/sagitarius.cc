import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sagitarius.cc',
  description: 'Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Script 
          type="module" 
          src="https://unpkg.com/esp-web-tools@10/dist/web/install-button.js?module" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
