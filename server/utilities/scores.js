import axios from 'axios';
import Scores from '../models/scores.js';
import { getWeekNumber } from './weeks.js';

export const getScores = (week = getWeekNumber()) => { 
    console.log('getting scores for week', week);
    return new Promise((resolve, reject) => {
        try {
            axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`)
                .then(res => {
                    resolve(mapScores(res.data));
                })    
        } catch (error) {
            reject('Error: ' + error);
        }
    })    
}

export const getSpread = (teamObj, spreadString = '') => {
    const [teamAbbreviation, spread] = spreadString.split(' ');
    const spreadNum = parseInt(spread, 10);
    // If team matches, return spread
    if (teamAbbreviation === teamObj.abbreviation) {
      return spreadNum;
    }
    // Otherwise return the negated number
    return spreadNum > 0 ? -Math.abs(spreadNum) : Math.abs(spreadNum);
  };
  
  export const mapScores = (scores) => {
    const games = scores.events.map((event) => event.competitions[0].competitors.map((team) => ({
      ...team,
      status: event.status,
      date: event.date,
      odds: event.competitions[0].odds,
    })));
  
    // console.log('games', games);
  
    const gameData = games.map((game) => ({
      teams: game.map((team) => ({
        homeAway: team.homeAway,
        displayName: team.team.displayName,
        abbreviation: team.team.abbreviation,
        score: team.score,
        name: team.team.name,
        odds: {
          spread: getSpread(team.team, team.odds[0]?.details),
          overUnder: team.odds?.[0].overUnder,
        },
      })),
      status: game[0]?.status?.type,
      date: game[0]?.date,
    }));
    // console.log('scores', scores);
    // console.log('mapped scores', gameData);
  
    return gameData;
  };
  
  

export const calculateBet = (bet, scores) => {
    for (const score of scores) {
        const teamName = bet.team.split('/')?.[0] || '';
        const betOnTeam = score.teams.find(team => team.displayName === teamName || teamName.indexOf(team.displayName) >= 0);
        if (betOnTeam && score.status.description === 'Final') {
            const opposingTeam = score.teams.find(team => team.displayName !== bet.team);
            switch(bet.type) {
                case 'points':
                    if (+betOnTeam.score + +bet.points === +opposingTeam.score) {
                        bet.result = 'T';
                    } else {
                        bet.result = +betOnTeam.score + +bet.points > +opposingTeam.score ? 'W' : 'L';
                    }
                    bet.processed = true;
                    break;
                case 'under':
                    if (+betOnTeam.score + +opposingTeam.score === bet.points) {
                        bet.result = 'T';
                    } else {
                        bet.result = +betOnTeam.score + +opposingTeam.score < bet.points? 'W' : 'L';
                    }
                    bet.processed = true;
                    break;
                case 'over':
                    if (+betOnTeam.score + +opposingTeam.score === bet.points) {
                        bet.result = 'T';
                    } else {
                        bet.result = +betOnTeam.score + +opposingTeam.score > bet.points? 'W' : 'L';
                    }
                    bet.processed = true;
                    break;
            }
            
            return bet;
        }
    }
    return bet;
  }


export const saveScores = (scores, week) => {
    const newScores = new Scores({
        scores: scores,
        name: `week${week}-spreads`
    });

    newScores.save()
      .catch(err => console.log('Error: ' + err));
}