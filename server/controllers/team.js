import { isAfter, isBefore, isSameDay } from 'date-fns';
import express from 'express';
import Spreads from '../models/spreads.js';
import { getWeeksObj } from '../utilities/weeks.js';


const router = express.Router();
const weeks = getWeeksObj();

export const createTeam = async (req, res) => { 
  try {
    const name = req.params.week ? `week${req.params.week}-spreads` : 'latestSpreads';
    Spreads.findOne({name: name})
      .then(data => {
        const spreadList = JSON.parse(data.spreads);
        const selectedWeek = req.params.week; 

        const startDate = new Date(weeks[selectedWeek].startDate);
        const endDate = new Date(weeks[selectedWeek].endDate);
        const filteredSpreadList = spreadList.filter(game => {
          const gameDate = new Date(game.commence_time);
          return (isSameDay(gameDate, startDate) || isAfter(gameDate, startDate))
                        && (isSameDay(gameDate, endDate) || isBefore(gameDate, endDate));
        });
        res.json(filteredSpreadList);
      });
  } catch (error) {
    res.status(400).json('Error: ' + err);
  }
};

export default router;