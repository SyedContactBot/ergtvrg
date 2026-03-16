import type {
  Movie,
  MovieDetail,
  PaginatedResponse,
  FilterCondition,
  LanguageOption,
  SearchHighlight,
  Actor,
  LiveTvChannel,
  CategoryOption,
  BrowseFilters,
} from '@/types';

const FILM_BASE = 'https://api.hbzws.com/film-api';
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

async function request<T>(
  base: string,
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${base}${path}`);
  const allParams = { ...DEFAULT_PARAMS, ...params };
  Object.entries(allParams).forEach(([k, v]) =>
    url.searchParams.set(k, String(v)),
  );
  const res = await fetch(url.toString(), {
    headers: HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const text = await res.text();
  if (!text || text.trim().length === 0) {
    throw new Error('Empty response from API');
  }
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON response from API');
  }
  if (json.code !== 200) throw new Error(json.msg || 'API Error');
  return json.data as T;
}

// ---- MOVIES / SHOWS ----

export async function getSearchConditions(): Promise<FilterCondition[]> {
  return request<FilterCondition[]>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/getSearchConditions',
  );
}

export async function getLanguages(): Promise<LanguageOption[]> {
  return request<LanguageOption[]>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/getLanguages',
  );
}

export async function browseContent(
  filters: BrowseFilters,
  page = 1,
  size = 20,
): Promise<PaginatedResponse<Movie>> {
  const params: Record<string, string | number> = { page, size };
  let idx = 0;
  const levels: { key: keyof BrowseFilters; level: number }[] = [
    { key: 'type', level: 1 },
    { key: 'language', level: 2 },
    { key: 'region', level: 3 },
    { key: 'genre', level: 4 },
    { key: 'year', level: 5 },
  ];
  for (const { key, level } of levels) {
    if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== 0) {
      params[`items[${idx}].level`] = level;
      params[`items[${idx}].value`] = filters[key]!;
      idx++;
    }
  }
  return request<PaginatedResponse<Movie>>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/getBySearchCondition',
    params,
  );
}

export async function getNewest(movieType = 2): Promise<Movie[]> {
  return request<Movie[]>(FILM_BASE, '/v1.9.0/flixfox/movie/getNewest', {
    movieType,
  });
}

export async function getMostViewed(movieType = 2): Promise<Movie[]> {
  return request<Movie[]>(FILM_BASE, '/v1.9.0/flixfox/movie/getMostViewed', {
    movieType,
  });
}

export async function getDetail(movieId: string): Promise<MovieDetail> {
  return request<MovieDetail>(FILM_BASE, '/v1.9.0/flixfox/movie/getDetail', {
    movieId,
  });
}

export async function getRecommendations(movieId: string): Promise<Movie[]> {
  return request<Movie[]>(FILM_BASE, '/v1.9.0/flixfox/movie/getRecommend', {
    movieId,
  });
}

export async function search(
  keyword: string,
  page = 1,
  size = 10,
): Promise<PaginatedResponse<Movie>> {
  return request<PaginatedResponse<Movie>>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/searchByKeyword',
    { keyword, page, size },
  );
}

export async function searchSuggestions(
  keyword: string,
): Promise<SearchHighlight> {
  return request<SearchHighlight>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/searchByKeywordAndHighLight',
    { keyword },
  );
}

// ---- ACTORS / DIRECTORS ----

export async function getActorInfo(id: string): Promise<Actor> {
  return request<Actor>(
    FILM_BASE,
    '/v1.9.0/flixfox/movieworker/getBasicInfo',
    { id },
  );
}

export async function getActorsByLetter(
  letter: string,
  page = 1,
): Promise<PaginatedResponse<Actor>> {
  return request<PaginatedResponse<Actor>>(
    FILM_BASE,
    '/v1.9.0/flixfox/movieworker/getByLetter',
    { letter, page, size: 20 },
  );
}

export async function getTodayBirthdays(): Promise<PaginatedResponse<Actor>> {
  return request<PaginatedResponse<Actor>>(
    FILM_BASE,
    '/v1.9.0/flixfox/movieworker/getByTodayBirthday',
  );
}

export async function getMoviesByActor(
  movieWorkerId: string,
  page = 1,
): Promise<PaginatedResponse<Movie>> {
  return request<PaginatedResponse<Movie>>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/getByMovieWorker',
    { movieWorkerId, page, size: 20 },
  );
}

// ---- LIVE TV ----

export async function getLiveTvCategories(): Promise<CategoryOption[]> {
  return request<CategoryOption[]>(
    LIVE_TV_BASE,
    '/v1.9.0/flixfox/livetv/getCategory',
  );
}

export async function getLiveTvLanguages(): Promise<LanguageOption[]> {
  return request<LanguageOption[]>(
    LIVE_TV_BASE,
    '/v1.9.0/flixfox/livetv/getlanguages',
  );
}

export async function getLiveTvChannels(
  languageId = 0,
  categoryId: number | string = 0,
  page = 1,
  size = 100,
): Promise<PaginatedResponse<LiveTvChannel>> {
  return request<PaginatedResponse<LiveTvChannel>>(
    LIVE_TV_BASE,
    '/v1.9.0/flixfox/livetv/getByLanguageAndCategory',
    { languageId, categoryId, page, size },
  );
}

// ---- VIDEO PLAYBACK ----

export interface VideoPlayInfo {
  videoUrl: string;
  expireTime: number;
  isPreview: boolean;
  videos: VideoSource[];
  subtitles: SubtitleTrack[];
  permissionDenied: boolean;
}

export interface SubtitleTrack {
  languageId: number;
  abbreviate: string;
  title: string;
  url: string;
  isDefault: boolean;
  isAI: number;
}

export async function getVideoPlayUrl(
  movieId: string,
  episodeId: string,
  resolution = 1,
): Promise<VideoPlayInfo> {
  return request<VideoPlayInfo>(
    FILM_BASE,
    '/v1.9.0/flixfox/movie/getVideo',
    { movieId, episodeId, resolution },
  );
}
