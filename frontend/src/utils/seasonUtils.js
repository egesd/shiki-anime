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

  // Helper function to get season from date
export function getSeasonFromDate(date) {
    if (!date) return null;
    const month = new Date(date).getMonth() + 1;
    if (month >= 1 && month <= 3) return 'winter';
    if (month >= 4 && month <= 6) return 'spring';
    if (month >= 7 && month <= 9) return 'summer';
    return 'fall';
  }