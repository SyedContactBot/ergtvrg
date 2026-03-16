export function formatDuration(seconds: number): string {
  if (!seconds) return '';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatYear(timestamp: number): string {
  if (!timestamp) return '';
  return new Date(timestamp).getFullYear().toString();
}

export function getResolutionBadge(resolution?: number, label?: string): string {
  if (label) return label;
  if (!resolution) return '';
  if (resolution >= 1080) return 'FHD';
  if (resolution >= 720) return 'HD';
  return 'SD';
}

export function getMovieTypeLabel(type: number): string {
  switch (type) {
    case 1: return 'TV Show';
    case 2: return 'Movie';
    case 3: return 'Reality';
    case 4: return 'Short';
    case 5: return 'Anime';
    default: return '';
  }
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function truncate(str: string, len: number): string {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.slice(0, len) + '...';
}

export function getImageUrl(url: string): string {
  if (!url) return '/placeholder.svg';
  if (url.startsWith('http')) return url;
  return url;
}
