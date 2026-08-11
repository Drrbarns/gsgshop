/**
 * GSG Convenience Goods — delivery fee formulas.
 *
 * Sole Express:
 *   (GH₵0.50 × km × 5) + (1.5% of purchase) − discount
 *
 * Joint Express (shared — fee is split in half):
 *   [(GH₵0.50 × km × 7) + (1.5% of purchase)] ÷ 2 − discount
 *
 * Free Delivery (Tue/Fri):
 *   (GH₵0.50 × km × 3) − (1% of purchase)
 *   (floored at GH₵0 — large orders can fully offset the distance fee)
 *
 * Pickup / Personal Shopper: GH₵0 on this platform.
 */

export type DeliveryMethodId =
  | 'sole-express'
  | 'joint-express'
  | 'free-delivery'
  | 'pickup'
  | 'personal-shopper'
  | string;

export const DELIVERY_RATE_PER_KM = 0.5; // GH₵
export const SOLE_EXPRESS_MULTIPLIER = 5;
export const JOINT_EXPRESS_MULTIPLIER = 7;
export const FREE_DELIVERY_MULTIPLIER = 3;
export const EXPRESS_PURCHASE_PCT = 0.015; // 1.5%
export const FREE_DELIVERY_PURCHASE_PCT = 0.01; // 1%

export type DeliveryBreakdown = {
  method: DeliveryMethodId;
  km: number;
  purchaseTotal: number;
  distanceComponent: number;
  purchaseComponent: number;
  rawTotal: number;
  discount: number;
  /** Final fee charged (never negative). */
  fee: number;
  /** Human-readable formula used. */
  formulaLabel: string;
  /** Line-by-line explanation for UI. */
  lines: string[];
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function methodNeedsDistance(method: DeliveryMethodId): boolean {
  return method === 'sole-express' || method === 'joint-express' || method === 'free-delivery';
}

export function calculateDeliveryFee(params: {
  method: DeliveryMethodId;
  km: number;
  purchaseTotal: number;
  /** Optional delivery discount in GHS (coupons). Default 0. */
  discount?: number;
}): DeliveryBreakdown {
  const method = params.method;
  const km = Math.max(0, Number(params.km) || 0);
  const purchaseTotal = Math.max(0, Number(params.purchaseTotal) || 0);
  const discount = Math.max(0, Number(params.discount) || 0);

  if (method === 'pickup' || method === 'personal-shopper') {
    return {
      method,
      km,
      purchaseTotal,
      distanceComponent: 0,
      purchaseComponent: 0,
      rawTotal: 0,
      discount: 0,
      fee: 0,
      formulaLabel: method === 'pickup' ? 'Pickup — no delivery fee' : 'Personal Shopper — priced separately',
      lines: ['No delivery fee on this option.'],
    };
  }

  if (method === 'sole-express') {
    const distanceComponent = DELIVERY_RATE_PER_KM * km * SOLE_EXPRESS_MULTIPLIER;
    const purchaseComponent = EXPRESS_PURCHASE_PCT * purchaseTotal;
    const rawTotal = distanceComponent + purchaseComponent;
    const fee = round2(Math.max(0, rawTotal - discount));
    return {
      method,
      km,
      purchaseTotal,
      distanceComponent: round2(distanceComponent),
      purchaseComponent: round2(purchaseComponent),
      rawTotal: round2(rawTotal),
      discount: round2(discount),
      fee,
      formulaLabel: 'GH₵0.50 × km × 5 + 1.5% of purchase − discount',
      lines: [
        `Distance: GH₵0.50 × ${km} km × 5 = GH₵${round2(distanceComponent).toFixed(2)}`,
        `Purchase share: 1.5% of GH₵${purchaseTotal.toFixed(2)} = GH₵${round2(purchaseComponent).toFixed(2)}`,
        ...(discount > 0 ? [`Discount: − GH₵${round2(discount).toFixed(2)}`] : []),
        `Your Sole Express fee: GH₵${fee.toFixed(2)}`,
      ],
    };
  }

  if (method === 'joint-express') {
    const distanceComponent = DELIVERY_RATE_PER_KM * km * JOINT_EXPRESS_MULTIPLIER;
    const purchaseComponent = EXPRESS_PURCHASE_PCT * purchaseTotal;
    const rawTotal = (distanceComponent + purchaseComponent) / 2;
    const fee = round2(Math.max(0, rawTotal - discount));
    return {
      method,
      km,
      purchaseTotal,
      distanceComponent: round2(distanceComponent),
      purchaseComponent: round2(purchaseComponent),
      rawTotal: round2(rawTotal),
      discount: round2(discount),
      fee,
      formulaLabel: '(GH₵0.50 × km × 7 + 1.5% of purchase) ÷ 2 − discount',
      lines: [
        `Distance: GH₵0.50 × ${km} km × 7 = GH₵${round2(distanceComponent).toFixed(2)}`,
        `Purchase share: 1.5% of GH₵${purchaseTotal.toFixed(2)} = GH₵${round2(purchaseComponent).toFixed(2)}`,
        `Shared (÷ 2): GH₵${round2(distanceComponent + purchaseComponent).toFixed(2)} ÷ 2 = GH₵${round2(rawTotal).toFixed(2)}`,
        ...(discount > 0 ? [`Discount: − GH₵${round2(discount).toFixed(2)}`] : []),
        `Your Joint Express share: GH₵${fee.toFixed(2)}`,
      ],
    };
  }

  if (method === 'free-delivery') {
    const distanceComponent = DELIVERY_RATE_PER_KM * km * FREE_DELIVERY_MULTIPLIER;
    const purchaseComponent = FREE_DELIVERY_PURCHASE_PCT * purchaseTotal;
    const rawTotal = distanceComponent - purchaseComponent;
    const fee = round2(Math.max(0, rawTotal));
    return {
      method,
      km,
      purchaseTotal,
      distanceComponent: round2(distanceComponent),
      purchaseComponent: round2(purchaseComponent),
      rawTotal: round2(rawTotal),
      discount: 0,
      fee,
      formulaLabel: 'GH₵0.50 × km × 3 − 1% of purchase',
      lines: [
        `Distance: GH₵0.50 × ${km} km × 3 = GH₵${round2(distanceComponent).toFixed(2)}`,
        `Purchase offset: 1% of GH₵${purchaseTotal.toFixed(2)} = − GH₵${round2(purchaseComponent).toFixed(2)}`,
        fee === 0
          ? 'Your Free Delivery fee: GH₵0.00 (fully offset)'
          : `Your Free Delivery fee: GH₵${fee.toFixed(2)}`,
      ],
    };
  }

  // Unknown method — don't invent a fee
  return {
    method,
    km,
    purchaseTotal,
    distanceComponent: 0,
    purchaseComponent: 0,
    rawTotal: 0,
    discount: 0,
    fee: 0,
    formulaLabel: 'Quoted at confirmation',
    lines: ['Fee will be confirmed with you before dispatch.'],
  };
}

/** Published formula copy for shipping page / FAQs. */
export const DELIVERY_FORMULA_COPY = [
  {
    id: 'sole-express' as const,
    name: 'Sole Express Delivery',
    schedule: 'Daily · 2hr–48hr windows',
    formula: 'GH₵0.50 × km × 5 + 1.5% of total purchase − discount',
    note: 'Required for fresh produce, bakery, meat, frozen, seafood, fish and poultry.',
  },
  {
    id: 'joint-express' as const,
    name: 'Joint Express Delivery',
    schedule: 'Daily · shared with a neighbour',
    formula: '(GH₵0.50 × km × 7 + 1.5% of total purchase) ÷ 2 − discount',
    note: 'You and a neighbour split the fee. Items stay private to each of you.',
  },
  {
    id: 'free-delivery' as const,
    name: 'Free Delivery',
    schedule: 'Tuesday & Friday only',
    formula: 'GH₵0.50 × km × 3 − 1% of total purchase',
    note: 'The 1% purchase offset can bring the fee down to GH₵0 for larger orders. Confirm before noon the preceding delivery day.',
  },
  {
    id: 'pickup' as const,
    name: 'Pickup',
    schedule: 'Within 72hrs (excl. Sunday)',
    formula: 'GH₵0 — no delivery fee',
    note: 'Collect at the hub shown in your order confirmation.',
  },
];
