import * as teamApi from '../api/teams';
import { SET_ALL_TEAMS, SET_SELECTED_TEAM } from '../constants/actionTypes';

export const getTeam = (teamId) => async (dispatch) => {
  try {
    const team = await teamApi.getTeam(teamId);

    dispatch({ type: SET_SELECTED_TEAM, payload: team.data });
  } catch (error) {
    console.log(error);
  }
};

export const editeamName = (teamId, newTeamName) => async (dispatch) => {
  try {
    const updatedTeam = await teamApi.editTeamName(teamId, newTeamName);

      dispatch({ type: SET_SELECTED_TEAM, payload: updatedTeam.data });
      return true;
  } catch (error) {
    console.log(error);
  }
};

export const getAllTeamsInLeague = (leagueId) => async (dispatch) => {
  try {
    const teams = await teamApi.getAllTeamsInLeague(leagueId);

    dispatch({ type: SET_ALL_TEAMS, payload: teams.data });
  } catch (error) {
    console.log(error);
  }
};

