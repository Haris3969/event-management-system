const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

async function request(path, params = {}) {
  if (!API_KEY) {
    throw new Error('Missing API key. Add VITE_TICKETMASTER_API_KEY to your .env file.');
  }
  const query = new URLSearchParams({ apikey: API_KEY });
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });

  const res = await fetch(`${BASE_URL}${path}?${query}`);
  if (!res.ok) {
    if (res.status === 429) throw new Error('Too many requests. Please wait a moment and retry.');
    if (res.status === 401) throw new Error('Invalid API key.');
    throw new Error(`Request failed (${res.status}).`);
  }
  return res.json();
}

// Flatten the API response into the fields the UI needs
export function toEvent(raw) {
  const venue = raw._embedded?.venues?.[0];
  const classification = raw.classifications?.[0];
  const start = raw.dates?.start;
  const price = raw.priceRanges?.[0];
  const image =
    [...(raw.images || [])]
      .sort((a, b) => a.width - b.width)
      .find((img) => img.ratio === '16_9' && img.width >= 640) || raw.images?.[0];

  return {
    id: raw.id,
    name: raw.name,
    date: start?.dateTime || start?.localDate || null,
    localDate: start?.localDate || null,
    localTime: start?.localTime || null,
    venue: venue?.name || null,
    address: venue?.address?.line1 || null,
    city: venue?.city?.name || null,
    state: venue?.state?.name || null,
    country: venue?.country?.name || null,
    category: classification?.segment?.name || null,
    genre: classification?.genre?.name || null,
    image: image?.url || null,
    url: raw.url || null,
    info: raw.info || raw.pleaseNote || null,
    status: raw.dates?.status?.code || null,
    price: price ? `${price.min} - ${price.max} ${price.currency}` : null,
  };
}

export function isPast(event) {
  return event.date ? new Date(event.date) < new Date() : false;
}

function nowIso() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export async function searchEvents({ keyword, category, city, startDate, page = 0 }) {
  const data = await request('/events.json', {
    keyword,
    classificationName: category,
    city,
    startDateTime: startDate ? `${startDate}T00:00:00Z` : nowIso(),
    sort: 'date,asc',
    size: 12,
    page,
  });
  return {
    events: (data._embedded?.events || []).map(toEvent),
    page: data.page?.number || 0,
    totalPages: data.page?.totalPages || 0,
  };
}

export async function getEvent(id) {
  const data = await request(`/events/${id}.json`);
  return toEvent(data);
}
