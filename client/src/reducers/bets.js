/* eslint-disable no-case-declarations */
import { ADD_BET, GET_LEAGUE_BETS, SET_TEAM_BETS } from 'constants/actionTypes';

export default (bets = { allBets: [], teamBets: {} }, action) => {
  let weekNum;
  let teamBets;
  switch (action.type) {
    case GET_LEAGUE_BETS:
      return { ...bets, allBets: action.payload };
    case SET_TEAM_BETS:
      return { ...bets, teamBets: { ...bets.teamBets, [action.payload.week]: action.payload.bets } };
    case ADD_BET:
      weekNum = action.payload[0]?.gameWeek;
      teamBets = weekNum ? { ...bets.teamBets, [weekNum]: action.payload } : bets.teamBets;
      return { ...bets, teamBets };
    default:
      return bets;
  }
};

