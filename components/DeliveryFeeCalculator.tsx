'use client';

import { useMemo, useState } from 'react';
import {
  calculateDeliveryFee,
  DELIVERY_FORMULA_COPY,
  type DeliveryMethodId,
} from '@/lib/delivery-pricing';

const METHOD_OPTIONS: Array<{ value: DeliveryMethodId; label: string }> = [
  { value: 'sole-express', label: 'Sole Express' },
  { value: 'joint-express', label: 'Joint Express' },
  { value: 'free-delivery', label: 'Free Delivery (Tue/Fri)' },
  { value: 'pickup', label: 'Pickup' },
];

export default function DeliveryFeeCalculator({
  defaultPurchase = 100,
  defaultKm = 5,
}: {
  defaultPurchase?: number;
  defaultKm?: number;
}) {
  const [method, setMethod] = useState<DeliveryMethodId>('sole-express');
  const [km, setKm] = useState(String(defaultKm));
  const [purchase, setPurchase] = useState(String(defaultPurchase));

  const breakdown = useMemo(() => {
    const kmNum = Math.max(0, parseFloat(km) || 0);
    const purchaseNum = Math.max(0, parseFloat(purchase) || 0);
    return calculateDeliveryFee({
      method,
      km: kmNum,
      purchaseTotal: purchaseNum,
    });
  }, [method, km, purchase]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gsg-purple px-6 py-5 text-white">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <i className="ri-calculator-line" />
          Delivery Fee Calculator
        </h3>
        <p className="text-white/80 text-sm mt-1">
          Enter your distance and cart total to see exactly what you&apos;ll pay.
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-5">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Delivery method</label>
          <div className="grid sm:grid-cols-2 gap-2">
            {METHOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMethod(opt.value)}
                className={`px-4 py-3 rounded-xl border-2 text-left text-sm font-semibold transition-all ${
                  method === opt.value
                    ? 'border-gsg-purple bg-purple-50 text-gsg-purple'
                    : 'border-gray-100 text-gray-700 hover:border-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="calc-km" className="block text-sm font-bold text-gray-700 mb-2">
              Distance from GSG hub (km)
            </label>
            <input
              id="calc-km"
              type="number"
              min={0}
              step={0.1}
              value={km}
              onChange={(e) => setKm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gsg-purple outline-none"
              placeholder="e.g. 8"
            />
          </div>
          <div>
            <label htmlFor="calc-purchase" className="block text-sm font-bold text-gray-700 mb-2">
              Total purchase (GH₵)
            </label>
            <input
              id="calc-purchase"
              type="number"
              min={0}
              step={0.01}
              value={purchase}
              onChange={(e) => setPurchase(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-gsg-purple outline-none"
              placeholder="e.g. 150"
            />
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 border border-gray-100 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Formula</p>
          <p className="text-sm font-medium text-gsg-black mb-4">{breakdown.formulaLabel}</p>
          <ul className="space-y-1.5 text-sm text-gray-600 mb-4">
            {breakdown.lines.map((line) => (
              <li key={line} className="flex gap-2">
                <i className="ri-arrow-right-s-line text-gsg-purple mt-0.5 shrink-0" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="font-bold text-gsg-black">Estimated delivery fee</span>
            <span className="text-2xl font-extrabold text-gsg-purple">
              {breakdown.fee === 0 ? 'GH₵0.00' : `GH₵${breakdown.fee.toFixed(2)}`}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Distance is measured from our GSG dispatch hub to your delivery address.
          Not sure of the km? Check Google Maps, or we&apos;ll confirm with you before payment if needed.
          Final fee at checkout uses the same formulas.
        </p>
      </div>

      {/* Compact formula reference */}
      <div className="border-t border-gray-100 bg-purple-50/40 px-6 py-5">
        <p className="text-xs font-bold uppercase tracking-wide text-gsg-purple mb-3">
          Published rates
        </p>
        <ul className="space-y-2">
          {DELIVERY_FORMULA_COPY.filter((f) => f.id !== 'pickup').map((f) => (
            <li key={f.id} className="text-sm">
              <span className="font-bold text-gsg-black">{f.name}:</span>{' '}
              <span className="text-gray-600">{f.formula}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
