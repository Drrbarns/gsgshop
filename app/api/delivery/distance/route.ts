import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from '@/lib/rate-limit';
import {
  distanceFromHubKm,
  estimateRoadKm,
  GSG_HUB,
  haversineKm,
  searchPopularPlaces,
  type LatLng,
} from '@/lib/delivery-hub';

/**
 * POST /api/delivery/distance
 *
 * Body: { query?: string; lat?: number; lng?: number }
 *
 * Resolves a Ghana location (popular list first, then OpenStreetMap Nominatim)
 * and returns approximate road distance (km) from the GSG East Legon hub.
 */

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

async function geocodeNominatim(query: string): Promise<{ label: string; point: LatLng } | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'gh');
  url.searchParams.set('addressdetails', '0');

  const res = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'GSGShopDelivery/1.0 (goods.gsgbrands.com.gh; delivery distance)',
      Accept: 'application/json',
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) return null;
  const data = (await res.json()) as NominatimResult[];
  if (!Array.isArray(data) || data.length === 0) return null;
  const hit = data[0];
  const lat = Number(hit.lat);
  const lng = Number(hit.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { label: hit.display_name, point: { lat, lng } };
}

async function roadKmViaOsrm(dest: LatLng): Promise<number | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${GSG_HUB.lng},${GSG_HUB.lat};${dest.lng},${dest.lat}?overview=false`;
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

    if (!query && !hasCoords) {
      return NextResponse.json(
        { success: false, message: 'Enter a location (e.g. East Legon, Spintex, Tema).' },
        { status: 400 }
      );
    }

    let label = '';
    let point: LatLng | null = null;
    let city: string | null = null;
    let region: string | null = null;
    let source: 'popular' | 'geocode' | 'coords' = 'coords';

    if (hasCoords) {
      point = { lat, lng };
      label = query || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
      source = 'coords';
    } else {
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
      const match = exact || starts || (query.length >= 4 && popularHits[0] ? popularHits[0] : null);

      if (match) {
        point = { lat: match.lat, lng: match.lng };
        label = `${match.name}, ${match.city}`;
        city = match.city;
        region = match.region;
        source = 'popular';
      }

      if (!point) {
        const geo = await geocodeNominatim(`${query}, Ghana`);
        if (!geo) {
          return NextResponse.json(
            {
              success: false,
              message: 'We could not find that location. Try a nearby landmark or area (e.g. Madina, Spintex).',
            },
            { status: 404 }
          );
        }
        point = geo.point;
        label = geo.label;
        source = 'geocode';
      }
    }

    const osrmKm = await roadKmViaOsrm(point);
    const km = osrmKm ?? estimateRoadKm(haversineKm(GSG_HUB, point));
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
      city,
      region,
      source,
      method,
      hub: GSG_HUB.label,
      // Also expose straight-line for debugging/admin — not shown in UI
      straightKm: Math.round(haversineKm(GSG_HUB, point) * 10) / 10,
      // Convenience: same as distanceFromHubKm when OSRM fails
      fallbackKm: distanceFromHubKm(point),
    });
  } catch (err: any) {
    console.error('[delivery/distance]', err?.message || err);
    return NextResponse.json({ success: false, message: 'Could not calculate distance' }, { status: 500 });
  }
}

/** GET — popular place suggestions for the location picker */
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
  const q = searchParams.get('q') || '';
  const suggestions = searchPopularPlaces(q, 8).map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: `${p.city}, ${p.region}`,
    city: p.city,
    region: p.region,
    lat: p.lat,
    lng: p.lng,
    km: distanceFromHubKm({ lat: p.lat, lng: p.lng }),
  }));

  return NextResponse.json({ success: true, suggestions, hub: GSG_HUB.label });
}
