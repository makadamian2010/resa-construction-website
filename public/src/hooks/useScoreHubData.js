import { useQuery } from '../lib/deps.js';
import { getLeagues, getMatch, getMatches, getPlayers } from '../data/api.js';

export function useLeagues() {
  return useQuery({
    queryKey: ['leagues'],
    queryFn: getLeagues
  });
}

export function useMatches(league) {
  return useQuery({
    queryKey: ['matches', league || 'all'],
    queryFn: () => getMatches(league)
  });
}

export function usePlayers(league) {
  return useQuery({
    queryKey: ['players', league || 'all'],
    queryFn: () => getPlayers(league)
  });
}

export function useMatch(id) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: () => getMatch(id),
    enabled: Boolean(id)
  });
}
