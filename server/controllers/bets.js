import express from 'express';
import Bet from '../models/bet.js';
import League from '../models/league.js';
import Team from '../models/team.js';
import { calculateBet, getScores } from '../utilities/scores.js';


const router = express.Router();

export const processWeekBets = async (req, res) => { 
  // const week = req.params.week;
  const week = 14;
  const scores = await getScores(week);
  const scoreMap = createScoreMap(scores);
  const promiseList = [];
  // Get leagues active for given week
  const leagueList = await League.find(
    {
      startWeek: {$lte: week},
      endWeek: {$gte: week}
    }); 

  leagueList.forEach(async league => {
    // Get list of teams within league
    const teamList = await Team.find({leagueId: league._id});
    teamList.forEach(async team => {
      const betList = await Bet.find({teamId: team._id, gameWeek: week, processed: false});
      let winnings = 0;
      betList.forEach(bet => {
        bet = calculateBet(bet, scoreMap);
        if (bet.result === 'W' || bet.result === 'T' ) {
          winnings += bet.result === 'W' ? bet.amount * 2 : bet.amount;
        }
      });
      team.balance += winnings;
      team.weekChange = team.balance - team.weekStartBalance;
      team.weekStartBalance = team.balance;
      promiseList.push(team.save());
       
      
    });
    const result = await Promise.all(promiseList)
      .then(() => true)
      .catch(error => {
        console.error(error.message);
        return false;
      });
  
    console.log('result', result, promiseList);
    return result;
  });

};

export const createScoreMap = (scores) => {
  const map = {};
  scores.forEach(game => {
    game.teams.forEach(team => {
      map[team.abbreviation] = team;
    });
  });
  return map;
};


export default router;