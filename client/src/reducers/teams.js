import { SET_ALL_TEAMS, SET_SELECTED_TEAM } from '../constants/actionTypes';

export default (teams = { selectedTeam: null, allTeams: [] }, action) => {
  switch (action.type) {
    case SET_SELECTED_TEAM:
      return { ...teams, selectedTeam: action.payload };
    case SET_ALL_TEAMS:
      return { ...teams, allTeams: action.payload };
    default:
      return teams;
  }
};

