import { ADD_BET, GET_LEAGUE_BETS, SET_TEAM_BETS } from "constants/actionTypes";

export default (bets = { allBets: [], teamBets: {} }, action) => {
  switch (action.type) {
    case GET_LEAGUE_BETS:
      return { ...bets, allBets: action.payload };
    case SET_TEAM_BETS:
      return { ...bets, teamBets: { ...bets.teamBets, [action.payload.week]: action.payload.bets } };
    case ADD_BET:
      const curWeekBets = bets.teamBets[action.payload.gameWeek];
      return { ...bets, teamBets: { ...bets.teamBets, [action.payload.gameWeek]: [...curWeekBets, action.payload] } };
    default:
      return bets;
  }
};

