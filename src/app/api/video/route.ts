import { NextRequest, NextResponse } from 'next/server';

const FILM_BASE = 'https://api.hbzws.com/film-api';
const DEFAULT_PARAMS: Record<string, string> = {
  clientType: '4',
  packageName: 'com.tenacious.flixfox',
  channel: 'FoxA',
};
const HEADERS: Record<string, string> = {
  appCode: 'FlixfoxWeb',
  Accept: 'application/json',
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const movieId = searchParams.get('movieId');
  const episodeId = searchParams.get('episodeId');
  const resolution = searchParams.get('resolution') || '1';

  if (!movieId || !episodeId) {
    return NextResponse.json(
      { error: 'movieId and episodeId are required' },
      { status: 400 },
    );
  }

  const url = new URL(`${FILM_BASE}/v1.9.0/flixfox/movie/getVideo`);
  const allParams = { ...DEFAULT_PARAMS, movieId, episodeId, resolution };
  Object.entries(allParams).forEach(([k, v]) =>
    url.searchParams.set(k, String(v)),
  );

  try {
    const res = await fetch(url.toString(), {
      headers: HEADERS,
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `API returned ${res.status}` },
        { status: res.status },
      );
    }

    const text = await res.text();
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Empty response from API' },
        { status: 502 },
      );
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON from API' },
        { status: 502 },
      );
    }

    if (json.code !== 200) {
      return NextResponse.json(
        { error: json.msg || 'API Error' },
        { status: 500 },
      );
    }

    return NextResponse.json(json.data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch video' },
      { status: 500 },
    );
  }
}
