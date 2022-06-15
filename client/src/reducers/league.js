import { GET_LEAGUES, SET_SELECTED_LEAGUE } from '../constants/actionTypes';

export default (leagues = { allLeagues: [], selectedLeague: null, selectedTeam: null }, action) => {
  switch (action.type) {
    case GET_LEAGUES:
      return { ...leagues, allLeagues: action.payload };
    case SET_SELECTED_LEAGUE:
      return { ...leagues, selectedLeague: action.payload };
    default:
      return leagues;
  }
};

