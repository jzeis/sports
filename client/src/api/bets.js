import { API } from './index.js';

export const getAllLeagueBets = (leagueId) => API.get(`/bet/league/${leagueId}/week`);
export const getTeamBets = (teamId, week) => API.get(`/bet/${teamId}/${week || ''}`);
