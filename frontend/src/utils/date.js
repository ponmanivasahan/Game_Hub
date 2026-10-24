
export function parseDate(dateValue) {
  if (!dateValue) return null;
  const d = new Date(dateValue);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(dateValue, options = {}) {
  const d = parseDate(dateValue);
  if (!d) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: options.shortMonth === false ? 'long' : 'short',
    day: 'numeric',
    year: 'numeric',
    ...options
  }).format(d);
}

export function formatDateTime(dateValue) {
  const d = parseDate(dateValue);
  if (!d) return '—';

  const dateStr = formatDate(d);
  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(d);

  return `${dateStr} · ${timeStr}`;
}

export function formatMonthYear(dateValue) {
  const d = parseDate(dateValue);
  if (!d) return '—';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric'
  }).format(d);
}

export function formatRelativeTime(dateValue) {
  const d = parseDate(dateValue);
  if (!d) return '—';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return formatDate(d);
  }

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'Yesterday';
  }
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks}w ago`;
  }

  return formatDate(d);
}

export function getReleaseInfo(releaseDateValue) {
  const d = parseDate(releaseDateValue);
  if (!d) {
    return {
      isUpcoming: false,
      label: 'TBA',
      fullText: 'Release date to be announced'
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const releaseDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const formatted = formatDate(d);
  const isUpcoming = releaseDay > today;

  return {
    isUpcoming,
    date: d,
    formatted,
    label: isUpcoming ? `Releases ${formatted}` : `Released ${formatted}`,
    badgeText: isUpcoming ? 'Coming Soon' : 'Released'
  };
}
