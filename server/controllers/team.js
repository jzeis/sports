import express from 'express';
import League from '../models/league.js';
import Team from '../models/team.js';

const router = express.Router();

export const createTeam = async (req, res) => {
  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' });
  }

  try {
    const league = await League.findOne({_id: req.body.leagueId});
    if(!league) {
      throw new Error('No league found');
    }

    const otherTeams = await Team.find({leagueId: league._id, ownerId: req.userId});
    if (otherTeams?.length) {
      throw new Error('Already in league');
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
      win: 0,
      loss: 0,
      tie: 0
    }); 
        
    newTeam.save()
      .then(() => {
        league.teams.push(newTeam._id);
        league.save();
        res.json(newTeam);
      })
      .catch(err => res.status(400).json(`${err}`));
  } catch (error) {
    res.status(400).json('Error' + error);
  }
};

export const changeTeamName = async (req, res) => { 
  try {
    const { teamName } = req.body;
    const team = await Team.findById(req.params.teamId);

    if (team.ownerId !== req.userId) {
      throw new Error('You\'re not the owner of this team');
    }

    team.teamName = teamName;
    team.save()
      .then(team => res.json(team))
      .catch((e) => {throw new Error(`Error saving new teamName - ${e}`);});
    
  } catch (error) {
    console.log('Error: ' + error);
    res.status(400).json('Error: ' + error);
  }
};

export const setWeeklyChange = async () => {
  const teams = await Team.find();
  teams.forEach(team => {
    const week1Data = { 1: team.weekChange};
    team.weekChangeData = JSON.stringify(week1Data);
    team.save();
  });

};

export default router;