export interface Movie {
  id: string;
  title: string;
  score: number;
  movieType: number;
  movieTypeName: string;
  coverHorizontalImage: string;
  coverVerticalImage: string;
  unlockPlayback: boolean;
  languages: string[];
  tags: string[];
  countries: string[];
  briefIntroduction?: string;
  publishTime: number;
  duration?: number;
  resolution?: number;
  indiaResolutionLabel?: string;
  memberLevel?: number;
  serverTime?: string;
  seasonDescription?: string;
  totalNumber?: number;
  seasonNumber?: number;
  woolUser?: boolean;
  isAuthorized?: boolean;
  rating?: number;
}

export interface Episode {
  id: string;
  title: string;
  number: number;
  coverImage: string;
  duration: number;
  videos: VideoSource[];
}

export interface VideoSource {
  resolution: number;
  resolutionDescription: string;
  size: number;
  premiumProPermission: boolean;
}

export interface MovieDetail extends Movie {
  originalTitle?: string;
  titbits: Titbit[];
  directors: PersonRef[];
  actors: ActorRef[];
  episodes: Episode[];
}

export interface Titbit {
  id: string;
  name: string;
  videoCategory: number;
  coverImage: string;
}

export interface PersonRef {
  id: string;
  name: string;
}

export interface ActorRef {
  id: string;
  name: string;
  avatar?: string;
}

export interface LiveTvChannel {
  id: string;
  name: string;
  coverImage: string;
}

export interface Actor {
  id: string;
  name: string;
  englishName?: string;
  avatar?: string;
  briefIntroduction?: string;
  bgColor?: string;
}

export interface FilterCondition {
  level: number;
  name: string;
  items: FilterItem[];
  icon?: string;
}

export interface FilterItem {
  name: string;
  value: number | string;
}

export interface SearchHighlight {
  highLightStartTag: string;
  highLightEndTag: string;
  movies: SearchHighlightMovie[];
  suggestionWords: string[];
}

export interface SearchHighlightMovie {
  id: string;
  title: string;
  highLightTitle: string;
}

export interface PaginatedResponse<T> {
  page: number;
  pages: number;
  size: number;
  total: number;
  rows: T[];
}

export interface LanguageOption {
  name: string;
  value: number;
}

export interface CategoryOption {
  name: string;
  value: number | string;
}

export interface BrowseFilters {
  type?: number | string;
  language?: number | string;
  genre?: number | string;
  region?: number | string;
  year?: number | string;
}
