'use client';

import { useEffect } from 'react';
import { platform } from '@/lib/platform';

/**
 * AppInitializer component
 * Handles native platform initialization on app load
 * - Configures status bar styling
 * - Sets up platform-specific behaviors
 */
export default function AppInitializer() {
  useEffect(() => {
    const initializeNative = async () => {
      if (platform.isNative()) {
        try {
          // Dynamically import to avoid issues on web
          const { StatusBar, Style } = await import('@capacitor/status-bar');

          // Set status bar style to match dark theme
          await StatusBar.setStyle({ style: Style.Dark });

          // Set background color on Android
          if (platform.isAndroid()) {
            await StatusBar.setBackgroundColor({ color: '#0f172a' });
          }
        } catch (e) {
          console.warn('StatusBar configuration failed:', e);
        }

        try {
          // Hide splash screen after initialization
          const { SplashScreen } = await import('@capacitor/splash-screen');
          await SplashScreen.hide();
        } catch (e) {
          console.warn('SplashScreen hide failed:', e);
        }
      }
    };

    initializeNative();
  }, []);

  // This component doesn't render anything
  return null;
}
