 
import { addMinutes, isAfter, isBefore } from 'date-fns';
import express from 'express';
import { minutesBeforeGameLock } from '../constants/config.constants.js';
import { processWeekBets } from '../controllers/bets.js';
import auth from '../middleware/auth.js';
import Bet from '../models/bet.js';
import League from '../models/league.js';
import Team from '../models/team.js';
import { getWeekNumber } from '../utilities/weeks.js';
const router = express.Router();

const saveBet = (bet, req, res) => {
  bet.save()
    .then(() => {
      // Subtract bet amount from team
      Team.updateOne({_id: req.body.teamId, ownerId: req.userId},
        {$inc: { balance: -Math.abs(bet.amount) }},
        (err, result) => {
          if (err) { console.log(err); res.send(err); return;}
        });
      res.json(bet);
    })
    .catch(err => res.status(400).json('Error: ' + err));
};

router.post('/add', auth, async (req, res) => {
  try {  
    if (!req.userId) {
      return res.json({ message: 'Unauthenticated' });
    }
    const {teamId, team, points, gameDate, type} = req.body;

    const userTeam = await Team.findOne({_id: teamId, ownerId: req.userId});

    if (!userTeam) {
      throw new Error('No team found');
    }

    const numAmount = parseInt(req.body.amount);
    if (userTeam?.balance < numAmount) {
      throw new Error('Not enough money for bet');
    }

    const currentTime = addMinutes(new Date(), minutesBeforeGameLock);

    // Filter out games that have started
    if (!isBefore(currentTime, new Date(gameDate))) {
      throw new Error('Game is locked');
    }

    if (numAmount <= 0) {
      throw new Error('Invalid bet amount');
    }  

    const bet = new Bet({
      userId: req.userId,
      teamId: teamId,
      team: team,
      points: points,
      type: type || 'points',
      amount: numAmount,
      gameWeek: await getWeekNumber(),
      gameDate: new Date(gameDate),
      processed: false
    });

    await bet.save();

    userTeam.balance = userTeam.balance - Math.abs(bet.amount);
    await userTeam.save();

    res.json(bet);
  }
  catch(err) {
    return res.status(400).json(err.toString());
  }
});

// Check this out - might not be used
router.get('/:teamId/:week?', auth, async (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }
  const week = req.params.week || await getWeekNumber();
  Bet.find({userId: req.userId, teamId: req.params.teamId, gameWeek: week })
    .then(bets => res.json(bets))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/league/:leagueId/week/:week?', auth, async(req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }
  const week = req.params.week || await getWeekNumber();
  //Todo - add check to make sure user owns team in league
  League.findById(req.params.leagueId)
    .then(league => {
      if (!league) {
        throw new Error('No league found');
      }
      Bet.find({teamId:  { $in : league.teams }, gameWeek: week })
        .then(bets => {
          const currentTime = new Date();
          const filteredBets = bets.filter(bet => {
            return isAfter(currentTime, new Date(bet.gameDate));
          });
          res.json(filteredBets);
        })
        .catch(err => res.status(400).json(err));
    })
    .catch(err => res.status(400).json('Error: ' + err));    
});

router.put('/process/:week', auth, processWeekBets);


export default router;

