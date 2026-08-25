import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import {
  distanceFromHubKm,
  estimateRoadKm,
  haversineKm,
  searchPopularPlaces,
  type LatLng,
} from '@/lib/delivery-hub';
import { getDeliverySettings } from '@/lib/delivery-settings';

/**
 * POST /api/delivery/distance
 * Body: { query?: string; lat?: number; lng?: number; reverse?: boolean }
 *
 * Resolves a Ghana location and returns road distance (km) from the GSG East Legon hub.
 *
 * GET /api/delivery/distance?q=...
 * Returns popular + Nominatim suggestions for the picker.
 */

const NOMINATIM_UA =
  'GSGShopDelivery/1.0 (goods.gsgbrands.com.gh; delivery distance)';

/** Greater Accra-ish viewbox (west,north,east,south) for Nominatim bias */
const ACCRA_VIEWBOX = '-0.45,5.85,0.15,5.40';

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
  type?: string;
  class?: string;
  address?: {
    city?: string;
    town?: string;
    suburb?: string;
    state?: string;
    county?: string;
  };
};

async function nominatimSearch(
  query: string,
  limit = 5
): Promise<Array<{ label: string; point: LatLng; city?: string; region?: string }>> {
  const attempts = [
    { q: query, countrycodes: 'gh', viewbox: ACCRA_VIEWBOX, bounded: '0' },
    { q: `${query}, Accra, Ghana`, countrycodes: 'gh', viewbox: ACCRA_VIEWBOX, bounded: '0' },
    { q: `${query}, Ghana`, countrycodes: 'gh' },
    { q: query }, // last resort — no country filter (matches escrow behaviour)
  ];

  for (const attempt of attempts) {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.set('q', attempt.q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('addressdetails', '1');
    if (attempt.countrycodes) url.searchParams.set('countrycodes', attempt.countrycodes);
    if (attempt.viewbox) {
      url.searchParams.set('viewbox', attempt.viewbox);
      url.searchParams.set('bounded', attempt.bounded || '0');
    }

    try {
      const res = await fetch(url.toString(), {
        headers: { 'User-Agent': NOMINATIM_UA, Accept: 'application/json' },
        next: { revalidate: 0 },
      });
      if (!res.ok) continue;
      const data = (await res.json()) as NominatimResult[];
      if (!Array.isArray(data) || data.length === 0) continue;

      return data
        .map((hit) => {
          const lat = Number(hit.lat);
          const lng = Number(hit.lon);
          if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
          return {
            label: hit.display_name,
            point: { lat, lng },
            city:
              hit.address?.suburb ||
              hit.address?.city ||
              hit.address?.town ||
              undefined,
            region: hit.address?.state || hit.address?.county || undefined,
          };
        })
        .filter(Boolean) as Array<{
        label: string;
        point: LatLng;
        city?: string;
        region?: string;
      }>;
    } catch {
      continue;
    }
  }
  return [];
}

async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{ label: string; city?: string; region?: string } | null> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lng));
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('addressdetails', '1');

  try {
    const res = await fetch(url.toString(), {
      headers: { 'User-Agent': NOMINATIM_UA, Accept: 'application/json' },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResult & { error?: string };
    if (data.error || !data.display_name) return null;
    return {
      label: data.display_name,
      city:
        data.address?.suburb ||
        data.address?.city ||
        data.address?.town ||
        undefined,
      region: data.address?.state || data.address?.county || undefined,
    };
  } catch {
    return null;
  }
}

async function roadKmViaOsrm(dest: LatLng, hub: LatLng): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${hub.lng},${hub.lat};${dest.lng},${dest.lat}?overview=false`;
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meters = data?.routes?.[0]?.distance;
    if (!Number.isFinite(meters) || meters <= 0) return null;
    return Math.max(0.5, Math.round((meters / 1000) * 10) / 10);
  } catch {
    return null;
  }
}

async function resolveDistance(point: LatLng, label: string, city?: string | null, region?: string | null, source?: string) {
  const { hub } = await getDeliverySettings();
  const osrmKm = await roadKmViaOsrm(point, hub);
  const km = osrmKm ?? estimateRoadKm(haversineKm(hub, point));
  const method = osrmKm != null ? 'road' : 'estimated';

  if (km > 500) {
    return NextResponse.json(
      {
        success: false,
        message: 'That location looks too far for our delivery zones. Please check the place name.',
      },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    km,
    label,
    city: city ?? null,
    region: region ?? null,
    lat: point.lat,
    lng: point.lng,
    source: source || 'coords',
    method,
    hub: hub.label,
    straightKm: Math.round(haversineKm(hub, point) * 10) / 10,
    fallbackKm: distanceFromHubKm(point, hub),
  });
}

export async function POST(req: Request) {
  try {
    const clientId = getClientIdentifier(req);
    const rate = checkRateLimit(`delivery-distance:${clientId}`, RATE_LIMITS.payment);
    if (!rate.success) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again shortly.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const query = typeof body.query === 'string' ? body.query.trim() : '';
    const lat = Number(body.lat);
    const lng = Number(body.lng);
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lng);
    const wantReverse = Boolean(body.reverse);

    if (!query && !hasCoords) {
      return NextResponse.json(
        { success: false, message: 'Enter a location or drop a pin on the map.' },
        { status: 400 }
      );
    }

    // Pin / GPS path — most reliable
    if (hasCoords) {
      let label = query || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      let city: string | null = null;
      let region: string | null = null;

      if (wantReverse || !query) {
        const rev = await reverseGeocode(lat, lng);
        if (rev) {
          label = rev.label;
          city = rev.city || null;
          region = rev.region || null;
        }
      }

      return resolveDistance({ lat, lng }, label, city, region, 'coords');
    }

    // Text search: popular list → Nominatim (multi-strategy)
    const popularHits = searchPopularPlaces(query, 5);
    const qLower = query.toLowerCase();
    const exact = popularHits.find(
      (p) => p.name.toLowerCase() === qLower || p.area.toLowerCase() === qLower
    );
    const starts = popularHits.find(
      (p) =>
        p.name.toLowerCase().startsWith(qLower) ||
        p.area.toLowerCase().startsWith(qLower)
    );
    const match = exact || starts || null;

    if (match) {
      return resolveDistance(
        { lat: match.lat, lng: match.lng },
        `${match.name}, ${match.city}`,
        match.city,
        match.region,
        'popular'
      );
    }

    const geoHits = await nominatimSearch(query, 1);
    if (geoHits.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            'We could not find that name. Drop a pin on the map, use your GPS, or try a nearby area (e.g. Madina, Spintex).',
        },
        { status: 404 }
      );
    }

    const geo = geoHits[0];
    return resolveDistance(geo.point, geo.label, geo.city, geo.region, 'geocode');
  } catch (err: any) {
    console.error('[delivery/distance]', err?.message || err);
    return NextResponse.json({ success: false, message: 'Could not calculate distance' }, { status: 500 });
  }
}

/** GET — popular + live geocode suggestions for the location picker */
export async function GET(req: Request) {
  const clientId = getClientIdentifier(req);
  const rate = checkRateLimit(`delivery-suggest:${clientId}`, {
    maxRequests: 60,
    windowSeconds: 60,
  });
  if (!rate.success) {
    return NextResponse.json({ success: false, suggestions: [] }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').trim();
  const { hub } = await getDeliverySettings();

  type SuggestionRow = {
    id: string;
    name: string;
    subtitle: string;
    city: string;
    region: string;
    lat: number;
    lng: number;
    km: number;
    source: 'popular' | 'geocode';
  };

  const popular: SuggestionRow[] = searchPopularPlaces(q, 6).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: `${p.city}, ${p.region}`,
    city: p.city,
    region: p.region,
    lat: p.lat,
    lng: p.lng,
    km: distanceFromHubKm({ lat: p.lat, lng: p.lng }, hub),
    source: 'popular',
  }));

  let geoSuggestions: SuggestionRow[] = [];
  if (q.length >= 3) {
    const hits = await nominatimSearch(q, 5);
    geoSuggestions = hits.map((h, i) => ({
      id: `geo-${i}-${h.point.lat.toFixed(4)}-${h.point.lng.toFixed(4)}`,
      name: h.label.split(',')[0]?.trim() || h.label,
      subtitle: h.label,
      city: h.city || '',
      region: h.region || '',
      lat: h.point.lat,
      lng: h.point.lng,
      km: distanceFromHubKm(h.point, hub),
      source: 'geocode',
    }));
  }

  // Dedupe by rounded lat/lng
  const seen = new Set<string>();
  const suggestions = [...popular, ...geoSuggestions].filter((s) => {
    const key = `${s.lat.toFixed(3)},${s.lng.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);

  return NextResponse.json({ success: true, suggestions, hub: hub.label });
}
