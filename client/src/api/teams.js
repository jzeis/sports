import { API } from './index.js';

export const getTeam = (teamId) => API.get(`/team/${teamId}`);
export const getTeams = () => API.get('/team/all');
export const getAllTeamsInLeague = (leagueId) => API.get(`/team/league/${leagueId}`);
export const editTeamName = (teamId, teamName) => API.post(`/team/updateTeam/${teamId}`, {teamName});
