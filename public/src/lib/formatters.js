export function formatMatchTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(value));
}

export function formatShortDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(value));
}

export function formatLongDateTime(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(value));
}

export function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function getStatusLabel(match) {
  if (match.status === 'live') return `${match.minute}'`;
  if (match.status === 'halftime') return 'HT';
  if (match.status === 'finished') return 'FT';
  return formatMatchTime(match.match_date);
}

export function isLiveLike(status) {
  return status === 'live' || status === 'halftime';
}
