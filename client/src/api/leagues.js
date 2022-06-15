import { API } from './index.js';

export const getLeagues = () => API.get('/league');
export const getLeague = (leagueId) => API.get(`/league/${leagueId}`);
