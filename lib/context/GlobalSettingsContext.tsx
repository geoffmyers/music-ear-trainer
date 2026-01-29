'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { GlobalSettings } from '@/lib/types/settings';
import { DEFAULT_SETTINGS } from '@/lib/types/settings';

const STORAGE_KEY = 'musicEarTrainer_globalSettings';

interface GlobalSettingsContextType {
  settings: GlobalSettings;
  updateSettings: (updates: Partial<GlobalSettings>) => void;
  resetSettings: () => void;
}

const GlobalSettingsContext = createContext<GlobalSettingsContextType | null>(null);

export function GlobalSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GlobalSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
    }
  }, [settings, isLoaded]);

  // Apply theme to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.setAttribute('data-theme', settings.colorTheme);
    }
  }, [settings.colorTheme, isLoaded]);

  const updateSettings = (updates: Partial<GlobalSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <GlobalSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (!context) {
    throw new Error('useGlobalSettings must be used within a GlobalSettingsProvider');
  }
  return context;
}
