 
import { isAfter } from 'date-fns';
import express from 'express';
import { calculateBet, getScores } from '../controllers/scores.js';
import auth from '../middleware/auth.js';
import Bet from '../models/bet.js';
import League from '../models/league.js';
import Team from '../models/team.js';
import { getWeekNumber } from '../utilities/weeks.js';
const router = express.Router();

router.post('/add', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const {teamId, team, points, gameDate, type} = req.body;
  const numAmount = parseInt(req.body.amount);
  const newBet = new Bet({
    userId: req.userId,
    teamId: teamId,
    team: team,
    points: points,
    type: type || 'points',
    amount: numAmount,
    gameWeek: getWeekNumber(gameDate),
    gameDate: new Date(gameDate),
    processed: false
  }); 

  newBet.save()
    .then(() => {
      // Subtract bet amount from team
      Team.updateOne({_id: req.body.teamId, ownerId: req.userId},
        {$inc: { balance: -Math.abs(numAmount) }},
        (err, result) => {
          if (err) { console.log(err); res.send(err); return;}
        })
      res.json(newBet)
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:teamId/:week?', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const week = req.params.week || getWeekNumber()
  Bet.find({userId: req.userId, teamId: req.params.teamId, gameWeek: week })
  .then(bets => res.json(bets))
  .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/league/:leagueId/week/:week?', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: "Unauthenticated" });
  }
  const week = req.params.week || getWeekNumber();
  //Todo - add check to make sure user owns team in league
  League.findById(req.params.leagueId)
    .then(league => {
      Bet.find({teamId:  { $in : league.teams }, gameWeek: week })
        .then(bets => {
          const currentTime = new Date();
          const filteredBets = bets.filter(bet => {
            // return true;
            return isAfter(currentTime, new Date(bet.gameDate));
          })
          res.json(filteredBets);
        })
        .catch(err => res.status(400).json('Error: ' + err));
    }) 
});

router.put('/processAll/:week?', auth, (req, res) => {
  const week = req.params.week || getWeekNumber();
  const promiseArray = [];
  getScores(week).then(scores => {

    Bet.find({processed: false, gameWeek: week}).then(betList => {
      betList.forEach(bet => {
        bet = calculateBet(bet, scores);
        const betPromise = new Promise((resolve, reject) => {
          bet.save((err, bet) => {
            if (err) { console.log(err); reject(err); }
            if (bet) {resolve(bet); }
          })
        })
        promiseArray.push(betPromise);

        let amountWon;
        switch(bet.result) {
          case 'W':
            amountWon = bet.amount * 2;
            break;
          case 'T':
            amountWon = bet.amount;
            break;
          default:
            amountWon = 0;
            break;
        }

        if (bet.result === 'W' || bet.result === 'T') {
          // Add winnings to team balance
          const teamPromise = new Promise((resolve, reject) => {
            Team.updateOne({_id: bet.teamId, ownerId: req.userId},
              {$inc: { balance: amountWon, weekEndBalance: amountWon }},
              (err, result) => {
                if (err) { console.log(err); reject(err); }
                if (result) {resolve(result); }
              })
          })
          promiseArray.push(teamPromise);
        }
      })      
    })
    
    Promise.all(promiseArray)
          .then(() => res.json('All bets processed'))
          .catch(err => res.status(400).json('Error: ' + err));
  })
  
})

export default router;

