import { Capacitor } from '@capacitor/core';

/**
 * Platform detection utilities for cross-platform compatibility
 */
export const platform = {
  /**
   * Check if running on a native platform (iOS or Android)
   */
  isNative: (): boolean => Capacitor.isNativePlatform(),

  /**
   * Check if running on iOS
   */
  isIOS: (): boolean => Capacitor.getPlatform() === 'ios',

  /**
   * Check if running on Android
   */
  isAndroid: (): boolean => Capacitor.getPlatform() === 'android',

  /**
   * Check if running on web
   */
  isWeb: (): boolean => Capacitor.getPlatform() === 'web',

  /**
   * Get the current platform name
   */
  getPlatform: (): string => Capacitor.getPlatform(),
};
