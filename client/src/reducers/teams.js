/* eslint-disable no-case-declarations */
import { SET_ALL_TEAMS, SET_SELECTED_TEAM, SUBTRACT_BALANCE } from '../constants/actionTypes';

export default (teams = { selectedTeam: null, allTeams: [] }, action) => {
  switch (action.type) {
    case SET_SELECTED_TEAM:
      return { ...teams, selectedTeam: action.payload };
    case SET_ALL_TEAMS:
      return { ...teams, allTeams: action.payload };
    case SUBTRACT_BALANCE:
      const { balance } = teams.selectedTeam;
      return { ...teams, selectedTeam: { ...teams.selectedTeam, balance: balance - action.payload } };
    default:
      return teams;
  }
};

