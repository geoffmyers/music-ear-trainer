import type { Metadata } from 'next';
import './globals.css';
import { GlobalSettingsProvider } from '@/lib/context/GlobalSettingsContext';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Music Ear Trainer',
  description: 'Interactive ear training game for musical intervals, chords, and progressions',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GlobalSettingsProvider>
          {children}
          <Footer />
        </GlobalSettingsProvider>
      </body>
    </html>
  );
}
