export const vibrate = (pattern: number | number[] = 50) => {
  if (typeof window !== 'undefined' && 'navigator' in window && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignore vibration errors
    }
  }
};

export const haptics = {
  light: () => vibrate(10),
  medium: () => vibrate(30),
  heavy: () => vibrate(50),
  success: () => vibrate([30, 50, 30]),
  error: () => vibrate([50, 100, 50, 100, 50]),
};
