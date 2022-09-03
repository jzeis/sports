 
import express from 'express';
import auth from '../middleware/auth.js';
import League from '../models/league.js';
import Team from '../models/team.js';
import User from '../models/user.js';
import { getWeekNumber } from '../utilities/weeks.js';
const router = express.Router();

router.get('/currentWeek', auth, async (req, res) => {
  try {
    const weekNum = await getWeekNumber();
    res.json(weekNum);
  }
  catch {
    res.status(400).json('Error getting current week number');
  }
});

router.post('/add', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  User.findOne({_id: req.userId})
    .then(user => {
        
      const newLeague = new League({
        commishionerId: req.userId,
        leagueName: req.body.leagueName,
        password: req.body.password,
        teams: [],
        maxTeams: req.body.maxTeams,
        startingBalance: req.body.startingBalance,
        startWeek: req.body.startWeek,
        // startDate: weeksObj[req.body.startWeek].startDate,
        endWeek: req.body.endWeek,
        // endDate: weeksObj[req.body.endWeek].endDate,
      }); 

      const newTeam = new Team({
        ownerId: req.userId,
        teamName: user.name,
        leagueId: newLeague._id,
        balance: newLeague.startingBalance,
        weekStartBalance: newLeague.startingBalance,
        win: 0,
        loss: 0,
        tie: 0
      }); 

      newLeague.teams.push(newTeam._id);
      const leaguePromise = new Promise((resolve, reject) => {
        newLeague.save()
          .then(resolve);
      });

      const teamPromise = new Promise((resolve, reject) => {
        newTeam.save()
          .then(resolve);
      });
      Promise.all([leaguePromise, teamPromise])
        .then(() => res.json('League added!'))
        .catch(err => res.status(400).json('Error: ' + err));
    });    
});

router.get('/:id', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }
  
  League.findById(req.params.id)
    .then(async (league) => {
      if (!league) { return res.status(400).json('no league found'); }

      league.currentWeek = await getWeekNumber();

      res.json(league);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  try {
    Team.find({ownerId: req.userId})
      .then(teams => {
        // Get array of league Id's
        const leagueIds = teams.map(team => team.leagueId);
        // Query leagues where _id is in leagueIds array
        League.find({ _id : { $in : leagueIds } })
          .then(leagues => {
            // if (!leagues || !leagues.length) { throw new Error('No league found') }            
            res.json(leagues);
          })
          .catch(err => { throw new Error('Error finding league');});
      });
  
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


export default router;

