'use client';

import { useEffect, useState } from 'react';
import {
  DEFAULT_DELIVERY_PRICING,
  normalizeDeliveryPricing,
  type DeliveryPricingConfig,
} from '@/lib/delivery-pricing';

/**
 * Live delivery pricing config from admin settings. Falls back to the
 * published defaults until the fetch resolves (server always recomputes
 * with live settings, so a brief default preview is safe).
 */
export function useDeliveryPricing(): DeliveryPricingConfig {
  const [config, setConfig] = useState<DeliveryPricingConfig>(DEFAULT_DELIVERY_PRICING);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/delivery/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.success && data.settings?.pricing) {
          setConfig(normalizeDeliveryPricing(data.settings.pricing));
        }
      })
      .catch(() => {
        // keep defaults
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
