import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GlobalSettingsProvider } from '@/lib/context/GlobalSettingsContext';
import Footer from './components/Footer';
import AppInitializer from './components/AppInitializer';

export const metadata: Metadata = {
  title: 'Music Ear Trainer',
  description: 'Interactive ear training game for musical intervals, chords, and progressions',
  icons: {
    icon: '/favicon.svg',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Music Ear Trainer',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppInitializer />
        <GlobalSettingsProvider>
          {children}
          <Footer />
        </GlobalSettingsProvider>
      </body>
    </html>
  );
}
