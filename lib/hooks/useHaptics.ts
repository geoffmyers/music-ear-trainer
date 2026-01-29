'use client';

import { useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { platform } from '../platform';

/**
 * Custom hook for haptic feedback on native platforms
 * Provides various haptic feedback patterns for UI interactions
 */
export const useHaptics = () => {
  /**
   * Light impact - for subtle button taps
   */
  const lightTap = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Light });
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  /**
   * Medium impact - for standard button presses
   */
  const mediumTap = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  /**
   * Heavy impact - for significant actions
   */
  const heavyTap = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  /**
   * Success notification - for correct answers
   */
  const success = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.notification({ type: NotificationType.Success });
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  /**
   * Warning notification - for near-misses or time warnings
   */
  const warning = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.notification({ type: NotificationType.Warning });
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  /**
   * Error notification - for incorrect answers
   */
  const error = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.notification({ type: NotificationType.Error });
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  /**
   * Selection changed - for picker/selection changes
   */
  const selectionChanged = useCallback(async () => {
    if (platform.isNative()) {
      try {
        await Haptics.selectionChanged();
      } catch (e) {
        console.warn('Haptics not available:', e);
      }
    }
  }, []);

  return {
    lightTap,
    mediumTap,
    heavyTap,
    success,
    warning,
    error,
    selectionChanged,
  };
};
