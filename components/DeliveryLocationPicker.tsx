'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { GSG_HUB } from '@/lib/delivery-hub';

export type DeliveryLocationResult = {
  km: number;
  label: string;
  city?: string | null;
  region?: string | null;
  lat?: number;
  lng?: number;
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

const DEFAULT_CENTER = { lat: GSG_HUB.lat, lng: GSG_HUB.lng };

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
  const [locating, setLocating] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showManual, setShowManual] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const distanceReqRef = useRef(0);

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
        // ignore — map / GPS still work
      }
    }, 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const applyDistance = useCallback(
    (km: number, label: string, meta?: Partial<DeliveryLocationResult>) => {
      const rounded = (Math.round(km * 10) / 10).toString();
      setSelectedLabel(label);
      setStatus(null);
      onDistanceChange(rounded, {
        km,
        label,
        city: meta?.city,
        region: meta?.region,
        lat: meta?.lat,
        lng: meta?.lng,
      });
      if (onPlaceFill) {
        onPlaceFill({
          city: meta?.city || undefined,
          region: meta?.region || undefined,
          addressHint: label.split(',')[0]?.trim(),
        });
      }
    },
    [onDistanceChange, onPlaceFill]
  );

  const fetchDistanceForCoords = useCallback(
    async (point: { lat: number; lng: number }, opts?: { labelHint?: string }) => {
      const reqId = ++distanceReqRef.current;
      setLoading(true);
      setStatus(null);
      try {
        const res = await fetch('/api/delivery/distance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: point.lat,
            lng: point.lng,
            reverse: true,
            query: opts?.labelHint || undefined,
          }),
        });
        const data = await res.json();
        if (reqId !== distanceReqRef.current) return;
        if (!res.ok || !data.success) {
          setStatus(data.message || 'Could not calculate distance for this pin.');
          return;
        }
        applyDistance(data.km, data.label, {
          city: data.city,
          region: data.region,
          lat: data.lat,
          lng: data.lng,
        });
        setQuery(data.label.split(',')[0]?.trim() || data.label);
      } catch {
        if (reqId === distanceReqRef.current) {
          setStatus('Something went wrong. Please try again.');
        }
      } finally {
        if (reqId === distanceReqRef.current) setLoading(false);
      }
    },
    [applyDistance]
  );

  const ensureMap = useCallback(async (point: { lat: number; lng: number }) => {
    const L = await import('leaflet');
    if (!mapContainerRef.current) return;

    const pinIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([point.lat, point.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(mapRef.current);

      // Soft hub ring so customers see where we dispatch from
      L.circle([GSG_HUB.lat, GSG_HUB.lng], {
        radius: 900,
        color: '#7c3aed',
        weight: 1,
        fillColor: '#7c3aed',
        fillOpacity: 0.08,
      }).addTo(mapRef.current);

      markerRef.current = L.marker([point.lat, point.lng], {
        draggable: true,
        icon: pinIcon,
      }).addTo(mapRef.current);

      markerRef.current.on('dragend', () => {
        if (!markerRef.current) return;
        const dragged = markerRef.current.getLatLng();
        const next = {
          lat: parseFloat(dragged.lat.toFixed(6)),
          lng: parseFloat(dragged.lng.toFixed(6)),
        };
        setCoords(next);
        void fetchDistanceForCoords(next);
      });

      mapRef.current.on('click', (e: { latlng: { lat: number; lng: number } }) => {
        const next = {
          lat: parseFloat(e.latlng.lat.toFixed(6)),
          lng: parseFloat(e.latlng.lng.toFixed(6)),
        };
        markerRef.current?.setLatLng([next.lat, next.lng]);
        setCoords(next);
        void fetchDistanceForCoords(next);
      });

      setMapReady(true);
    } else {
      mapRef.current.setView([point.lat, point.lng], 15);
      markerRef.current?.setLatLng([point.lat, point.lng]);
    }

    setTimeout(() => mapRef.current?.invalidateSize(), 120);
  }, [fetchDistanceForCoords]);

  // Boot map on Accra hub so the UI isn't empty
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await ensureMap(DEFAULT_CENTER);
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount once
  }, []);

  useEffect(() => {
    if (!coords) return;
    void ensureMap(coords);
  }, [coords, ensureMap]);

  const placePin = (point: { lat: number; lng: number }, labelHint?: string) => {
    setCoords(point);
    void ensureMap(point);
    void fetchDistanceForCoords(point, { labelHint });
  };

  const pickSuggestion = (s: Suggestion) => {
    setQuery(s.name);
    setOpen(false);
    placePin({ lat: s.lat, lng: s.lng }, `${s.name}, ${s.city}`);
  };

  const searchAndPin = async () => {
    const q = query.trim();
    if (!q) {
      setStatus('Search an area, or tap the map to drop your pin.');
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
        setStatus(
          data.message ||
            'Name not found — tap the map or use GPS to drop your pin instead.'
        );
        return;
      }
      if (Number.isFinite(data.lat) && Number.isFinite(data.lng)) {
        setCoords({ lat: data.lat, lng: data.lng });
        await ensureMap({ lat: data.lat, lng: data.lng });
      }
      applyDistance(data.km, data.label, {
        city: data.city,
        region: data.region,
        lat: data.lat,
        lng: data.lng,
      });
    } catch {
      setStatus('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setStatus('GPS is not available on this device.');
      return;
    }
    setLocating(true);
    setStatus(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const point = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
        };
        setLocating(false);
        placePin(point);
      },
      (err) => {
        setLocating(false);
        setStatus(err.message || 'Could not read your location. Allow location access and try again.');
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  const clearSelection = () => {
    setSelectedLabel(null);
    setQuery('');
    setCoords(null);
    onDistanceChange('');
    setStatus(null);
    void ensureMap(DEFAULT_CENTER);
  };

  const kmNum = parseFloat(valueKm);
  const hasDistance = Number.isFinite(kmNum) && kmNum > 0;

  return (
    <div ref={wrapRef} className="space-y-3">
      <div>
        <label htmlFor="delivery-location" className="block text-sm font-bold text-gray-700 mb-1">
          Delivery location <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-3 text-pretty">
          Search, use GPS, or tap the map — then drag the pin to your exact spot. Distance is measured from our Accra hub.
        </p>

        <div className="overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-b from-purple-50/80 via-white to-white shadow-[0_8px_30px_rgba(124,58,237,0.06)]">
          {/* Search row */}
          <div className="p-3 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <i className="ri-search-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gsg-purple text-lg pointer-events-none" />
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
                      else void searchAndPin();
                    }
                  }}
                  className={`w-full pl-11 pr-4 py-3 border rounded-xl bg-white focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none text-sm ${
                    error ? 'border-red-500 bg-red-50' : 'border-gray-200'
                  }`}
                  placeholder="Search area or landmark…"
                  autoComplete="off"
                />
                {open && suggestions.length > 0 && (
                  <ul
                    id={listId}
                    role="listbox"
                    className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-xl border border-gray-100 bg-white shadow-xl shadow-purple-500/10"
                  >
                    {suggestions.map((s) => (
                      <li key={s.id} role="option">
                        <button
                          type="button"
                          onClick={() => pickSuggestion(s)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-purple-50 transition-colors"
                        >
                          <span className="min-w-0">
                            <span className="block font-semibold text-gsg-black truncate">{s.name}</span>
                            <span className="block text-xs text-gray-500 truncate text-pretty">{s.subtitle}</span>
                          </span>
                          <span className="shrink-0 tabular-nums text-sm font-bold text-gsg-purple">
                            {s.km} km
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                type="button"
                onClick={() => void searchAndPin()}
                disabled={loading}
                className="sm:w-auto px-5 py-3 rounded-xl bg-gsg-purple text-white font-bold hover:bg-gsg-purple-dark transition-colors disabled:opacity-70 whitespace-nowrap text-sm shadow-sm shadow-purple-500/20"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin" /> Finding…
                  </span>
                ) : (
                  'Pin on map'
                )}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={useMyLocation}
                disabled={locating || loading}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:border-gsg-purple hover:text-gsg-purple transition-colors disabled:opacity-60"
              >
                {locating ? (
                  <i className="ri-loader-4-line animate-spin text-gsg-purple" />
                ) : (
                  <i className="ri-crosshair-2-line text-gsg-purple" />
                )}
                Use my GPS
              </button>
              {coords && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:border-gsg-purple hover:text-gsg-purple transition-colors"
                >
                  <i className="ri-external-link-line text-gsg-purple" />
                  Open in Google Maps
                </a>
              )}
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            {status && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                {status}
              </p>
            )}
          </div>

          {/* Map */}
          <div className="relative border-t border-purple-100/80">
            <div
              ref={mapContainerRef}
              className="h-56 sm:h-64 w-full bg-gray-100 z-0"
              aria-label="Delivery map — tap to drop pin, drag to adjust"
            />
            {!mapReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-gray-100 text-sm text-gray-500">
                <span className="inline-flex items-center gap-2">
                  <i className="ri-loader-4-line animate-spin text-gsg-purple" />
                  Loading map…
                </span>
              </div>
            )}
            <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 px-2.5 py-1.5 text-[11px] font-medium text-gray-600 shadow-sm border border-gray-100">
              Tap map or drag the pin
            </div>
            {coords && (
              <div className="pointer-events-none absolute right-3 bottom-3 rounded-lg bg-gsg-black/80 px-2.5 py-1.5 text-[10px] font-mono text-white/90 tabular-nums">
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </div>
            )}
          </div>

          {/* Distance result */}
          {hasDistance && (
            <div className="flex items-start justify-between gap-3 border-t border-green-100 bg-green-50/90 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-sm font-bold text-green-900 tabular-nums">
                  {kmNum.toFixed(1)} km from hub
                </p>
                {selectedLabel && (
                  <p className="text-xs text-green-800/80 mt-0.5 line-clamp-2 text-pretty">
                    {selectedLabel}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs font-semibold text-green-900 underline shrink-0 pt-0.5"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      </div>

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
