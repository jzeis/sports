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
