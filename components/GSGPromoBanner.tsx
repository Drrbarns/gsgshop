'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'gsg_promo_dismissed';

export default function GSGPromoBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setDismissed(stored === 'true');
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
      setDismissed(true);
    } catch {}
  };

  if (dismissed) return null;

  return (
    <div className="bg-gsg-purple text-white py-2.5 px-4 text-center text-sm relative">
      <p className="font-medium">
        🎁 Free gift for every purchase
      </p>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <i className="ri-close-line text-lg" />
      </button>
    </div>
  );
}
