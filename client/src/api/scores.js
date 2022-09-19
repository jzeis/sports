import axios from 'axios';

export const getScores = (week) => axios.get(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}&dates=2022`);

