/**
 * GSG dispatch hub + distance helpers.
 * Hub: East Legon, Accra (primary pickup/dispatch area).
 */

export type LatLng = { lat: number; lng: number };

export const GSG_HUB: LatLng & { label: string } = {
  lat: 5.6355,
  lng: -0.1538,
  label: 'GSG Hub — East Legon, Accra',
};

/** Straight-line km (Haversine). */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/**
 * Estimate road distance when a routing API is unavailable.
 * Urban Ghana roads are rarely a straight line — ~1.35× is a practical factor.
 */
export function estimateRoadKm(straightKm: number): number {
  return Math.max(0.5, Math.round(straightKm * 1.35 * 10) / 10);
}

export type PopularPlace = {
  id: string;
  name: string;
  area: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
};

/** Common Accra / Greater Accra delivery areas for instant lookup. */
export const POPULAR_DELIVERY_PLACES: PopularPlace[] = [
  { id: 'east-legon', name: 'East Legon', area: 'East Legon', city: 'Accra', region: 'Greater Accra', lat: 5.6355, lng: -0.1538 },
  { id: 'osu', name: 'Osu', area: 'Osu', city: 'Accra', region: 'Greater Accra', lat: 5.5557, lng: -0.1745 },
  { id: 'labone', name: 'Labone', area: 'Labone', city: 'Accra', region: 'Greater Accra', lat: 5.5665, lng: -0.1665 },
  { id: 'airport', name: 'Airport Residential', area: 'Airport Residential', city: 'Accra', region: 'Greater Accra', lat: 5.6055, lng: -0.1715 },
  { id: 'dzorwulu', name: 'Dzorwulu', area: 'Dzorwulu', city: 'Accra', region: 'Greater Accra', lat: 5.6085, lng: -0.1935 },
  { id: 'cantonments', name: 'Cantonments', area: 'Cantonments', city: 'Accra', region: 'Greater Accra', lat: 5.5785, lng: -0.1705 },
  { id: 'adabraka', name: 'Adabraka', area: 'Adabraka', city: 'Accra', region: 'Greater Accra', lat: 5.5655, lng: -0.2085 },
  { id: 'tema', name: 'Tema', area: 'Tema', city: 'Tema', region: 'Greater Accra', lat: 5.6698, lng: -0.0166 },
  { id: 'madina', name: 'Madina', area: 'Madina', city: 'Accra', region: 'Greater Accra', lat: 5.6831, lng: -0.1669 },
  { id: 'legon', name: 'Legon / University of Ghana', area: 'Legon', city: 'Accra', region: 'Greater Accra', lat: 5.6505, lng: -0.1870 },
  { id: 'haatso', name: 'Haatso', area: 'Haatso', city: 'Accra', region: 'Greater Accra', lat: 5.6685, lng: -0.1925 },
  { id: 'achimota', name: 'Achimota', area: 'Achimota', city: 'Accra', region: 'Greater Accra', lat: 5.6275, lng: -0.2265 },
  { id: 'dansoman', name: 'Dansoman', area: 'Dansoman', city: 'Accra', region: 'Greater Accra', lat: 5.5455, lng: -0.2655 },
  { id: 'spintex', name: 'Spintex', area: 'Spintex', city: 'Accra', region: 'Greater Accra', lat: 5.6355, lng: -0.0885 },
  { id: 'teshie', name: 'Teshie', area: 'Teshie', city: 'Accra', region: 'Greater Accra', lat: 5.5835, lng: -0.1045 },
  { id: 'kasoa', name: 'Kasoa', area: 'Kasoa', city: 'Kasoa', region: 'Central', lat: 5.5345, lng: -0.4165 },
  { id: 'accra-central', name: 'Accra Central', area: 'Accra Central', city: 'Accra', region: 'Greater Accra', lat: 5.5560, lng: -0.1969 },
  { id: 'kaneshie', name: 'Kaneshie', area: 'Kaneshie', city: 'Accra', region: 'Greater Accra', lat: 5.5705, lng: -0.2375 },
  { id: 'lapaz', name: 'Lapaz', area: 'Lapaz', city: 'Accra', region: 'Greater Accra', lat: 5.6055, lng: -0.2485 },
  { id: 'ashaiman', name: 'Ashaiman', area: 'Ashaiman', city: 'Ashaiman', region: 'Greater Accra', lat: 5.6885, lng: -0.0355 },
  { id: 'nungua', name: 'Nungua', area: 'Nungua', city: 'Accra', region: 'Greater Accra', lat: 5.6015, lng: -0.0775 },
  { id: 'westhills', name: 'Weija / West Hills', area: 'Weija', city: 'Accra', region: 'Greater Accra', lat: 5.5655, lng: -0.3335 },
  { id: 'sakumono', name: 'Sakumono', area: 'Sakumono', city: 'Tema', region: 'Greater Accra', lat: 5.6225, lng: -0.0555 },
  { id: 'kwabenya', name: 'Kwabenya', area: 'Kwabenya', city: 'Accra', region: 'Greater Accra', lat: 5.7055, lng: -0.2055 },
  { id: 'adjiringanor', name: 'Adjiringanor', area: 'Adjiringanor', city: 'Accra', region: 'Greater Accra', lat: 5.6485, lng: -0.1355 },
  { id: 'trasacco', name: 'Trasacco Valley', area: 'Trasacco', city: 'Accra', region: 'Greater Accra', lat: 5.6225, lng: -0.1285 },
  { id: 'kumasi', name: 'Kumasi (city centre)', area: 'Kumasi', city: 'Kumasi', region: 'Ashanti', lat: 6.6885, lng: -1.6244 },
  { id: 'takoradi', name: 'Takoradi', area: 'Takoradi', city: 'Takoradi', region: 'Western', lat: 4.8845, lng: -1.7554 },
  { id: 'cape-coast', name: 'Cape Coast', area: 'Cape Coast', city: 'Cape Coast', region: 'Central', lat: 5.1053, lng: -1.2466 },
];

export function searchPopularPlaces(query: string, limit = 8): PopularPlace[] {
  const q = query.trim().toLowerCase();
  if (!q) return POPULAR_DELIVERY_PLACES.slice(0, limit);
  return POPULAR_DELIVERY_PLACES.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.area.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
  ).slice(0, limit);
}

export function distanceFromHubKm(dest: LatLng): number {
  return estimateRoadKm(haversineKm(GSG_HUB, dest));
}
