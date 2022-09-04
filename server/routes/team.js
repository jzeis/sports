 
import express from 'express';
import auth from '../middleware/auth.js';
import League from '../models/league.js';
import Team from '../models/team.js';
const router = express.Router();

router.post('/add', auth, (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  try {
    League.findOne({_id: req.body.leagueId})
      .then(league => {
        if(!league) {
          throw new Error('No league found');
        }
  
        if(req.body.password !== league.password) {
          throw new Error('Invalid password');
        }
          
        const newTeam = new Team({
          ownerId: req.userId,
          teamName: req.userName,
          leagueId: league._id,
          balance: league.startingBalance,
          weekStartBalance: league.startingBalance,
          weekEndBalance: league.startingBalance
        }); 
        
        newTeam.save()
          .then(() => {
            league.teams.push(newTeam._id);
            league.save();
            res.json('Team added!');
          })
          .catch(err => res.status(400).json(`${err}`));
      })
      .catch(err => {
        console.log(err);
        res.status(400).json(`${err}`);
      });
      
  } catch (error) {
    res.status(400).json('Error' + error);
  }

});

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
      const teamList = teams.map(({_id, teamName, weekStartBalance, win, loss, tie, weekChange = 0}) => ({_id, teamName, weekStartBalance, win, loss, tie, weekChange}));
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
      res.json(team);
    })
    .catch(err => res.status(400).json('Error: ' + err));
});

export default router;

