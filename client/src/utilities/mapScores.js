export const getSpread = (teamObj, spreadString = '') => {
  if (spreadString.toLowerCase() === 'even') {
    return 0;
  }
  const [teamAbbreviation, spread] = spreadString.split(' ');
  const spreadNum = parseFloat(spread);
  // If team matches, return spread
  if (teamAbbreviation === teamObj.abbreviation) {
    return spreadNum;
  }
  // Otherwise return the negated number
  return spreadNum > 0 ? -Math.abs(spreadNum) : Math.abs(spreadNum);
};

export const mapScores = (scores) => {
  const games = scores.events.map((event) => event.competitions[0].competitors.map((team) => ({
    ...team,
    status: event.status,
    date: event.date,
    odds: event.competitions[0].odds,
  })));

  const gameData = games.map((game) => ({
    teams: game.map((team) => ({
      homeAway: team.homeAway,
      displayName: team.team.displayName,
      abbreviation: team.team.abbreviation,
      score: team.score,
      name: team.team.name,
      id: team.id,
      odds: {
        spread: getSpread(team.team, team.odds?.[0]?.details),
        overUnder: team.odds?.[0].overUnder,
      },
    })),
    status: game[0]?.status?.type,
    date: game[0]?.date,
  }));

  return gameData;
};

