import express from 'express';
import Bet from '../models/bet.js';
import League from '../models/league.js';
import Team from '../models/team.js';
import { calculateBet, getScores } from '../utilities/scores.js';
import { incrementWeekNumber } from '../utilities/weeks.js';


const router = express.Router();

export const processWeekBets = async (req, res) => { 
  const week = req.params.week;
  const scores = await getScores(week);
  const scoreMap = createScoreMap(scores);
  // console.log(scoreMap);
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
      // let winnings = 0;
      betList.forEach(bet => {
        bet = calculateBet(bet, scoreMap);
        
        switch(bet.result) {
        case 'W':
          team.win++;
          team.balance += (bet.amount * 2);
          break;
        case 'L':
          team.loss++;
          break;
        case 'T':
          team.tie++;
          team.balance += bet.amount;
        }
        
        promiseList.push(bet.save());
      });
      // team.balance += winnings;
      team.weekChange = team.balance - team.weekStartBalance;
      team.weekStartBalance = team.balance;
      promiseList.push(team.save());
    });
  });

  const result = await Promise.all(promiseList)
    .then(() => {
      incrementWeekNumber();
      return true;
    })
    .catch(error => {
      console.error(error.message);
      return false;
    });

  return result;
};

export const deleteBets = async (week) => {
  const betList = await Bet.find({gameWeek: week});
  betList.forEach(bet => bet.delete());
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

export const calculateRecords = async (req, res) => { 
  const promiseList = [];
  // Get leagues active for given week
  const leagueList = await League.find(); 

  leagueList.forEach(async league => {
    // Get list of teams within league
    const teamList = await Team.find({leagueId: league._id});
    teamList.forEach(async team => {
      team.win = 0;
      team.loss = 0;
      team.tie = 0;
      const betList = await Bet.find({teamId: team._id, processed: true});
      betList.forEach(bet => {        
        switch(bet.result) {
        case 'W':
          team.win++;
          break;
        case 'L':
          team.loss++;
          break;
        case 'T':
          team.tie++;
        }
        
      });
      promiseList.push(team.save());
    });
  });

  const result = await Promise.all(promiseList)
    .then(() => {
      return true;
    })
    .catch(error => {
      console.error(error.message);
      return false;
    });

  return result;
};


export default router;