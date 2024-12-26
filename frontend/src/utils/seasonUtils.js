export function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 0 && month <= 2) return 'winter';
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  return 'fall';
}

export function isCurrentSeason(anime) {
  const currentYear = new Date().getFullYear();
  const currentSeason = getCurrentSeason();
  return anime.year === currentYear && anime.season === currentSeason;
}