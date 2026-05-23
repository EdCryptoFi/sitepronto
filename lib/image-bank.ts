// ─── IMAGE BANK ───────────────────────────────────────────────────────────────
// Banco curado de queries por segmento para Unsplash API.
// Fluxo: save-draft → fetchSegmentImages → armazena URLs no content_notes
// Site-generator → usa URLs armazenadas em vez de SVG placeholder

export type ImageSet = {
  hero: string;
  gallery: string[];
  catalog: string;
};

// ─── QUERIES CURADAS POR SEGMENTO ─────────────────────────────────────────────
// Queries em inglês — Unsplash tem melhor cobertura em EN
// Múltiplas alternativas por slot para variar entre clientes do mesmo segmento

const SEGMENT_QUERIES: Record<string, { hero: string[]; gallery: string[]; catalog: string[] }> = {
  mecanica: {
    hero: ['auto mechanic garage workshop', 'car repair shop professional', 'automotive workshop clean'],
    gallery: [
      'mechanic working on car engine',
      'car lift garage auto repair',
      'car tire alignment service',
      'car oil change service',
    ],
    catalog: ['car parts tools garage'],
  },
  restaurante: {
    hero: ['restaurant food plating gourmet', 'beautiful dish restaurant table', 'restaurant interior cozy dining'],
    gallery: [
      'chef cooking restaurant kitchen',
      'gourmet food plating close up',
      'restaurant interior ambient lighting',
      'fresh ingredients food preparation',
    ],
    catalog: ['gourmet food plating restaurant'],
  },
  clinica: {
    hero: ['modern medical clinic interior', 'doctor patient consultation', 'healthcare professional clinic'],
    gallery: [
      'medical examination room equipment',
      'doctor smiling patient care',
      'clinic reception waiting room',
      'health diagnostic equipment modern',
    ],
    catalog: ['medical health care professional'],
  },
  loja: {
    hero: ['modern retail store interior', 'boutique shop display products', 'clean store shelves products'],
    gallery: [
      'retail store product display',
      'customer shopping store',
      'product packaging gift box',
      'store shelves organized retail',
    ],
    catalog: ['product display clean background'],
  },
  advocacia: {
    hero: ['law office professional desk', 'lawyer office books professional', 'legal office interior professional'],
    gallery: [
      'law books library professional',
      'business meeting conference room',
      'lawyer signing contract document',
      'justice scale law office',
    ],
    catalog: ['legal documents contract professional'],
  },
  beleza: {
    hero: ['hair salon interior modern', 'beauty salon professional stylist', 'barber shop modern interior'],
    gallery: [
      'hairdresser cutting hair salon',
      'nail art manicure beauty',
      'hair treatment professional salon',
      'beauty products professional cosmetics',
    ],
    catalog: ['beauty cosmetics professional products'],
  },
  construcao: {
    hero: ['construction site modern building', 'architect blueprint professional', 'home renovation interior modern'],
    gallery: [
      'construction workers building project',
      'modern interior renovation design',
      'architectural blueprint drawing plans',
      'building tools construction site',
    ],
    catalog: ['construction materials tools building'],
  },
  educacao: {
    hero: ['modern classroom education students', 'teacher students learning environment', 'education library modern'],
    gallery: [
      'students studying group library',
      'teacher explaining whiteboard classroom',
      'education books study learning',
      'online learning computer education',
    ],
    catalog: ['books education learning knowledge'],
  },
  veterinaria: {
    hero: ['veterinarian examining dog clinic', 'vet clinic dog cat care', 'animal hospital professional vet'],
    gallery: [
      'veterinarian dog examination table',
      'cat vaccination vet clinic',
      'pet grooming bath salon',
      'animal care veterinary professional',
    ],
    catalog: ['pet care veterinary clinic'],
  },
  petshop: {
    hero: ['pet shop store dogs cats', 'dog grooming bath salon professional', 'pet store products shelves'],
    gallery: [
      'dog happy grooming bath',
      'pet store products food',
      'cat playing pet shop',
      'dog training obedience class',
    ],
    catalog: ['pet products food accessories store'],
  },
  academia: {
    hero: ['modern gym fitness center interior', 'gym workout equipment fitness', 'fitness center training professional'],
    gallery: [
      'personal trainer gym workout',
      'group fitness class exercise',
      'gym equipment weights machines',
      'crossfit training functional fitness',
    ],
    catalog: ['gym fitness equipment weights'],
  },
  imobiliaria: {
    hero: ['modern house exterior architecture', 'real estate luxury home interior', 'apartment living room modern'],
    gallery: [
      'modern home interior design',
      'house exterior landscaping garden',
      'luxury apartment kitchen design',
      'real estate signing contract keys',
    ],
    catalog: ['house property real estate modern'],
  },
  contabilidade: {
    hero: ['accountant office professional desk', 'financial planning business professional', 'accounting documents office work'],
    gallery: [
      'business financial planning graphs',
      'accountant working computer office',
      'tax documents paperwork organized',
      'financial meeting business professional',
    ],
    catalog: ['financial documents accounting office'],
  },
  tecnologia: {
    hero: ['software developer coding computer', 'technology office modern workspace', 'IT professional team workspace'],
    gallery: [
      'programmer coding multiple screens',
      'tech team meeting collaboration',
      'server room data center',
      'software interface dashboard modern',
    ],
    catalog: ['technology software computer modern'],
  },
  farmacia: {
    hero: ['pharmacy interior clean modern', 'pharmacist counter medicine', 'drugstore professional health'],
    gallery: [
      'pharmacist helping customer medicine',
      'pharmacy shelves organized medicine',
      'health products vitamins supplements',
      'pharmacy consultation professional',
    ],
    catalog: ['medicine pharmacy health products'],
  },
  turismo: {
    hero: ['cozy pousada hotel room', 'hotel pool nature view', 'beautiful travel destination tourism'],
    gallery: [
      'hotel room interior cozy design',
      'hotel pool garden view',
      'breakfast buffet hotel morning',
      'travel destination landscape beautiful',
    ],
    catalog: ['hotel room amenities travel'],
  },
  transporte: {
    hero: ['moving truck transport logistics', 'delivery truck professional service', 'logistics warehouse organized'],
    gallery: [
      'moving team loading truck professional',
      'delivery driver package door',
      'logistics warehouse organized boxes',
      'transport truck highway road',
    ],
    catalog: ['delivery package logistics transport'],
  },
  fotografia: {
    hero: ['professional photographer studio shooting', 'wedding photographer couple outdoor', 'photography studio equipment light'],
    gallery: [
      'photographer shooting portrait studio',
      'wedding couple photography outdoor',
      'corporate photo shoot professional',
      'camera equipment studio setup',
    ],
    catalog: ['photography camera equipment professional'],
  },
  generico: {
    hero: ['professional business office modern', 'team meeting collaboration workspace', 'business professional work environment'],
    gallery: [
      'professional team meeting office',
      'business workspace modern interior',
      'entrepreneur working laptop cafe',
      'business handshake professional deal',
    ],
    catalog: ['business professional service modern'],
  },
};

// ─── UNSPLASH FETCHER ─────────────────────────────────────────────────────────

async function fetchUnsplashUrl(query: string, orientation: 'landscape' | 'portrait' = 'landscape'): Promise<string | null> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) return null;

  try {
    const params = new URLSearchParams({
      query,
      per_page: '5',
      orientation,
      content_filter: 'high',
    });
    const res = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
      headers: { Authorization: `Client-ID ${key}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const results = data.results ?? [];
    if (results.length === 0) return null;
    // Pick a random result from top 5 for variety between clients
    const pick = results[Math.floor(Math.random() * results.length)];
    return `${pick.urls.regular}&w=1200&q=80` as string;
  } catch {
    return null;
  }
}

function pickQuery(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── PUBLIC API ───────────────────────────────────────────────────────────────

export async function fetchSegmentImages(segment: string, businessName?: string): Promise<ImageSet | null> {
  const queries = SEGMENT_QUERIES[segment] ?? SEGMENT_QUERIES.generico;

  // Fetch hero + 3 gallery images in parallel
  const [hero, g0, g1, g2, catalog] = await Promise.all([
    fetchUnsplashUrl(pickQuery(queries.hero)),
    fetchUnsplashUrl(queries.gallery[0] ?? pickQuery(queries.hero)),
    fetchUnsplashUrl(queries.gallery[1] ?? pickQuery(queries.hero)),
    fetchUnsplashUrl(queries.gallery[2] ?? pickQuery(queries.hero)),
    fetchUnsplashUrl(pickQuery(queries.catalog)),
  ]);

  // If none fetched (no API key), return null — site-generator falls back to SVGs
  if (!hero && !g0) return null;

  return {
    hero: hero ?? g0 ?? '',
    gallery: [g0, g1, g2].filter(Boolean) as string[],
    catalog: catalog ?? hero ?? '',
  };
}

// ─── SEARCH QUERIES EXPORT (for context-engine enrichment) ───────────────────

export function getSegmentQueries(segment: string): typeof SEGMENT_QUERIES[string] {
  return SEGMENT_QUERIES[segment] ?? SEGMENT_QUERIES.generico;
}
