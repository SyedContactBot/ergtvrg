import { NextRequest, NextResponse } from 'next/server';

const LIVE_TV_BASE = 'https://api.hbzws.com/film-live-tv';
const DEFAULT_PARAMS: Record<string, string> = {
  clientType: '4',
  packageName: 'com.tenacious.flixfox',
  channel: 'FoxA',
};
const HEADERS: Record<string, string> = {
  appCode: 'FlixfoxWeb',
  Accept: 'application/json',
};

async function tryGetStreamUrl(channelId: string): Promise<string | null> {
  const endpoints = [
    `${LIVE_TV_BASE}/v1.9.0/flixfox/livetv/getPlayInfo`,
    `${LIVE_TV_BASE}/v1.9.0/flixfox/livetv/getVideo`,
    `${LIVE_TV_BASE}/v1.9.0/flixfox/livetv/getPlayUrl`,
    `${LIVE_TV_BASE}/v1.9.0/flixfox/livetv/getStreamUrl`,
  ];

  for (const endpoint of endpoints) {
    try {
      const url = new URL(endpoint);
      const allParams = { ...DEFAULT_PARAMS, id: channelId };
      Object.entries(allParams).forEach(([k, v]) =>
        url.searchParams.set(k, String(v)),
      );

      const res = await fetch(url.toString(), {
        headers: HEADERS,
        next: { revalidate: 0 },
      });

      if (!res.ok) continue;

      const text = await res.text();
      if (!text || text.trim().length === 0) continue;

      let json;
      try {
        json = JSON.parse(text);
      } catch {
        continue;
      }

      if (json.code === 200 && json.data) {
        const data = json.data;
        if (typeof data === 'string') return data;
        if (data.streamUrl) return data.streamUrl;
        if (data.videoUrl) return data.videoUrl;
        if (data.playUrl) return data.playUrl;
        if (data.url) return data.url;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const channelId = searchParams.get('id');

  if (!channelId) {
    return NextResponse.json(
      { error: 'Channel id is required' },
      { status: 400 },
    );
  }

  try {
    const streamUrl = await tryGetStreamUrl(channelId);

    if (!streamUrl) {
      return NextResponse.json(
        { error: 'Stream not available for this channel. The live stream endpoint may require a premium subscription.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ streamUrl });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch stream' },
      { status: 500 },
    );
  }
}
