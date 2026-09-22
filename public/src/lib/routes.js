export function createPageUrl(pageName) {
  if (pageName === 'Home') return '/Home';
  if (pageName === 'Standings') return '/Standings';
  if (pageName === 'TopScorers') return '/TopScorers';
  if (pageName === 'MatchDetails') return '/MatchDetails';
  return '/Home';
}
