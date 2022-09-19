 
import express from 'express';
import { changeTeamName, createTeam } from '../controllers/team.js';
import auth from '../middleware/auth.js';
import Team from '../models/team.js';
const router = express.Router();

router.post('/add', auth, createTeam);

router.post('/updateTeam/:teamId', auth, changeTeamName);

router.get('/all', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  Team.find({ownerId: req.userId})
    .then(leagues => res.json(leagues))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/league/:leagueId', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  Team.find({leagueId: req.params.leagueId})
    .then(teams => {
      const teamList = teams
        .map(({_id, teamName, weekStartBalance, win, loss, tie, weekChange = 0, weekChangeData}) => ({_id, teamName, weekStartBalance, win, loss, tie, weekChange, weekChangeData: JSON.parse(weekChangeData)}));
      res.json(teamList);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

router.get('/:id?', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  Team.findById(req.params.id)
    .then(team => {
      res.json({...team.toObject(), weekChangeData: JSON.parse(team.weekChangeData)});
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

export default router;

