// Unsplash image service — uses free-tier Unsplash API
// Falls back to SVG placeholders if API key is missing or fails

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function searchUnsplashImage(query: string): Promise<string | null> {
  if (!UNSPLASH_ACCESS_KEY) return null;

  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

export function unsplashUrl(query: string, w = 800, h = 600): string {
  // Free tier: via sources.unsplash.com (no API key needed for basic usage)
  // But this is a redirect-based service, not reliable for production
  return `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(query)}`;
}
