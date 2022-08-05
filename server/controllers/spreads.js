import express from 'express';
import { removeGamesAfterStart } from '../constants/config.constants.js';
import Spreads from '../models/spreads.js';
import { getWeekNumber } from '../utilities/weeks.js';


const router = express.Router();
// const weeks = weeksObj;

export const getSpreads = async (req, res) => { 
  try {
    const {week: selectedWeek} = req.params || getWeekNumber();
    const name = req.params.week ? `week${selectedWeek}-spreads` : 'latestSpreads';
    console.log('getting spreads for week', name);
    Spreads.findOne({name: name})
      .then(data => {
        let spreadList = JSON.parse(data.spreads);
        if (removeGamesAfterStart) {
          // const startDate = new Date(weeks[selectedWeek].startDate);
          // const endDate = new Date(weeks[selectedWeek].endDate);
          // const currentTime = new Date();
                    
          // Filter out games that have started
          // spreadList = spreadList.filter(game => {
          //     const gameDate = new Date(game.date);
          //     return (isSameDay(gameDate, startDate) || isAfter(gameDate, startDate))
          //         && (isSameDay(gameDate, endDate) || isBefore(gameDate, endDate)
          //         && isBefore(currentTime, gameDate));
          // })
        }
        const returnObj = {
          spreads: spreadList,
          id: data.id
        };

        res.json(returnObj);
      });
  } catch (error) {
    res.status(400).json('Error: ' + error);
  }
};

function getRandomSpread(max) {
  return Math.floor(Math.random() * max) + .5;
}

export const generateSpreads = async (weekNum) => { 
  try {
    const name = `week${weekNum}-spreads`;
    const spreadsObj = await Spreads.findOne({name: name});
    let spreadsList = JSON.parse(spreadsObj.spreads);

    spreadsList.forEach(game => {
      const overUnder = 40 + getRandomSpread(15);
      const favorite = getRandomSpread(14);
      const underDog = 0 - favorite;
            
      game.teams.forEach((team, i) => {
        team.odds = {
          overUnder,
          spread: i === 0 ? favorite : underDog
        };
      });
    });

    spreadsObj.spreads = JSON.stringify(spreadsList);

    spreadsObj.save();

  }
  catch(error) {
    console.log(error);
  }
};

export default router;