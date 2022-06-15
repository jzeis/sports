import * as betsApi from '../api/bets';
import { GET_LEAGUE_BETS, SET_TEAM_BETS } from '../constants/actionTypes';

export const getLeagueBets = (leagueId) => async (dispatch) => {
  try {
    const bets = await betsApi.getAllLeagueBets(leagueId);

    dispatch({ type: GET_LEAGUE_BETS, payload: bets.data });
  } catch (error) {
    console.log(error);
  }
};

export const getTeamBets = (teamId, weekNum) => async (dispatch) => {
  try {
    const bets = await betsApi.getTeamBets(teamId, weekNum);
    const week = weekNum || bets.data[0]?.gameWeek;

    // If no week then it must be an empty result for the current week
    if (week) {
      const payload = { bets: bets.data, week };

      dispatch({ type: SET_TEAM_BETS, payload });
    }
  } catch (error) {
    console.log(error);
  }
};
