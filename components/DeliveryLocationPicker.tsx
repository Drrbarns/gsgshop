'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type DeliveryLocationResult = {
  km: number;
  label: string;
  city?: string | null;
  region?: string | null;
};

type Suggestion = {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  km: number;
};

type DeliveryLocationPickerProps = {
  valueKm: string;
  onDistanceChange: (km: string, meta?: DeliveryLocationResult) => void;
  onPlaceFill?: (fields: { city?: string; region?: string; addressHint?: string }) => void;
  error?: string;
};

export default function DeliveryLocationPicker({
  valueKm,
  onDistanceChange,
  onPlaceFill,
  error,
}: DeliveryLocationPickerProps) {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [showManual, setShowManual] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/delivery/distance?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.suggestions || []);
          setOpen(true);
        }
      } catch {
        // ignore suggestion failures — user can still press Calculate
      }
    }, 220);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const applyResult = (km: number, label: string, city?: string | null, region?: string | null) => {
    const rounded = (Math.round(km * 10) / 10).toString();
    setSelectedLabel(label);
    setStatus(null);
    onDistanceChange(rounded, { km, label, city, region });
    if (onPlaceFill) {
      onPlaceFill({
        city: city || undefined,
        region: region || undefined,
        addressHint: label.split(',')[0]?.trim(),
      });
    }
  };

  const pickSuggestion = (s: Suggestion) => {
    setQuery(s.name);
    setOpen(false);
    applyResult(s.km, `${s.name}, ${s.city}`, s.city, s.region);
  };

  const calculateFromQuery = async () => {
    const q = query.trim();
    if (!q) {
      setStatus('Type your area or landmark (e.g. Spintex, Madina).');
      return;
    }
    setLoading(true);
    setStatus(null);
    setOpen(false);
    try {
      const res = await fetch('/api/delivery/distance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus(data.message || 'Could not find that location.');
        return;
      }
      applyResult(data.km, data.label, data.city, data.region);
    } catch {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedLabel(null);
    setQuery('');
    onDistanceChange('');
    setStatus(null);
  };

  const kmNum = parseFloat(valueKm);
  const hasDistance = Number.isFinite(kmNum) && kmNum > 0;

  return (
    <div ref={wrapRef} className="space-y-3">
      <div>
        <label htmlFor="delivery-location" className="block text-sm font-bold text-gray-700 mb-2">
          Delivery location <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Search your area or landmark — we&apos;ll work out the distance from our Accra hub for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <i className="ri-map-pin-line absolute left-3 top-1/2 -translate-y-1/2 text-gsg-purple text-lg pointer-events-none" />
            <input
              id="delivery-location"
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedLabel(null);
              }}
              onFocus={() => suggestions.length > 0 && setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (suggestions[0] && query.trim()) pickSuggestion(suggestions[0]);
                  else void calculateFromQuery();
                }
              }}
              className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
              }`}
              placeholder="e.g. East Legon, Spintex, Tema Community 1"
              autoComplete="off"
            />
            {open && suggestions.length > 0 && (
              <ul
                id={listId}
                role="listbox"
                className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-gray-100 bg-white shadow-xl"
              >
                {suggestions.map((s) => (
                  <li key={s.id} role="option">
                    <button
                      type="button"
                      onClick={() => pickSuggestion(s)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-purple-50 transition-colors"
                    >
                      <span>
                        <span className="block font-semibold text-gsg-black">{s.name}</span>
                        <span className="block text-xs text-gray-500">{s.subtitle}</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-gsg-purple">{s.km} km</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            onClick={() => void calculateFromQuery()}
            disabled={loading}
            className="sm:w-auto px-5 py-3 rounded-xl bg-gsg-purple text-white font-bold hover:bg-gsg-purple-dark transition-colors disabled:opacity-70 whitespace-nowrap"
          >
            {loading ? 'Finding…' : 'Get distance'}
          </button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
        {status && <p className="text-xs text-amber-700 mt-1.5">{status}</p>}
      </div>

      {hasDistance && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-green-900">
              Distance: {kmNum.toFixed(1)} km
            </p>
            {selectedLabel && (
              <p className="text-xs text-green-800/80 mt-0.5 truncate">{selectedLabel}</p>
            )}
            <p className="text-[11px] text-green-800/70 mt-1">
              From our Accra hub · used for your delivery total
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs font-semibold text-green-900 underline shrink-0"
          >
            Change
          </button>
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setShowManual((v) => !v)}
          className="text-xs font-semibold text-gray-500 hover:text-gsg-purple"
        >
          {showManual ? 'Hide manual distance' : 'Enter distance manually instead'}
        </button>
        {showManual && (
          <div className="mt-2">
            <label htmlFor="delivery-km-manual" className="sr-only">
              Distance in km
            </label>
            <input
              id="delivery-km-manual"
              type="number"
              min={0.1}
              step={0.1}
              value={valueKm}
              onChange={(e) => {
                setSelectedLabel(null);
                onDistanceChange(e.target.value);
              }}
              className="w-full max-w-xs px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple outline-none"
              placeholder="km"
            />
          </div>
        )}
      </div>
    </div>
  );
}
