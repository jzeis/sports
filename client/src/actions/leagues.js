import axios from 'axios';
import * as leagueApi from '../api/leagues';
import * as teamApi from '../api/teams';
import { GET_LEAGUES, SET_SELECTED_LEAGUE } from '../constants/actionTypes';

export const getLeaguesAndTeams = (selectedLeagueId, selectedTeamId) => async (dispatch) => {
  try {
    const [leagues, teams] = await axios.all([leagueApi.getLeagues(), teamApi.getTeams()]);
    const mappedLeagues = leagues.data.map((league) => ({ ...league, team: teams.data.find((team) => league.teams.indexOf(team._id) >= 0) }));

    dispatch({ type: GET_LEAGUES, payload: mappedLeagues });
    if (selectedLeagueId) {
      dispatch({ type: SET_SELECTED_LEAGUE, payload: mappedLeagues.find((league) => league._id === selectedLeagueId) });
    }
    // if (selectedTeamId) {
    //   dispatch({ type: SET_SELECTED_TEAM, payload: selectedTeamId });
    // }
  } catch (error) {
    console.log(error);
  }
};

export const getLeague = (leagueId) => async (dispatch) => {
  try {
    const league = await leagueApi.getLeague(leagueId);

    dispatch({ type: SET_SELECTED_LEAGUE, payload: league.data });
  } catch (error) {
    console.log(error);
  }
};
