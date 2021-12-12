import { betTypes } from '../constants/betTypes.constants.js';

export const calculateBet = (betOnTeam, opposingTeam, bet) => {
  switch (bet.type) {
    case 'points':
      return +betOnTeam.score + +bet.points > +opposingTeam.score ? 'Win' : 'Loss';
    case 'over':
      return +betOnTeam.score + +opposingTeam.score > +bet.points ? 'Win' : 'Loss';
    case 'under':
      return +betOnTeam.score + +opposingTeam.score < +bet.points ? 'Win' : 'Loss';

    default:
      return null;
  }
};

export const calculateBets = (bets, scores) => {
  let amountWon = 0;

  const newBets = bets.map((bet) => {
    // Figure out team name
    const teamName = bet.type === betTypes.over || betTypes.under ? bet.team.split('/')[0] : bet.team;
    // Find the game in the list of espn scores
    const game = scores.find((gameScore) => gameScore.teams.find((team) => team.displayName === teamName || teamName.indexOf(team.displayName) >= 0));

    // Create new bet object
    const newBet = { ...bet };
    if (game && game.status.description === 'Final') {
      const betOnTeam = game.teams.find((team) => team.displayName === teamName || teamName.indexOf(team.displayName) >= 0);
      const opposingTeam = game.teams.find((team) => team !== betOnTeam);
      // Get bet result
      newBet.result = calculateBet(betOnTeam, opposingTeam, newBet);
      // Add amount won
      amountWon = newBet.result === 'Win' ? +amountWon + +newBet.amount : +amountWon - +newBet.amount;
    }

    return newBet;
  });

  return [newBets, amountWon];
};
