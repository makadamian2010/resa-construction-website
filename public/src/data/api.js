export async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json();
}

export function getLeagues() {
  return fetchJson('/api/leagues');
}

export function getMatches(league) {
  const query = league ? `?league=${encodeURIComponent(league)}` : '';
  return fetchJson(`/api/matches${query}`);
}

export function getPlayers(league) {
  const query = league ? `?league=${encodeURIComponent(league)}` : '';
  return fetchJson(`/api/players${query}`);
}

export function getMatch(id) {
  return fetchJson(`/api/matches/${id}`);
}
