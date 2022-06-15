import axios from 'axios';

export const getScores = (week) => axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`);

