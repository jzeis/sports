import { isAfter, isBefore, isSameDay } from 'date-fns';
import express from 'express';
import { removeGamesAfterStart } from '../constants/config.constants.js';
import Spreads from '../models/spreads.js';
import { getWeekNumber, weeksObj } from '../utilities/weeks.js';


const router = express.Router();
const weeks = weeksObj;

export const getSpreads = async (req, res) => { 
    try {
        const {week: selectedWeek} = req.params || getWeekNumber();
        const name = req.params.week ? `week${selectedWeek}-spreads` : 'latestSpreads'
        Spreads.findOne({name: name})
            .then(data => {
                let spreadList = JSON.parse(data.spreads);

                if (removeGamesAfterStart) {
                    const startDate = new Date(weeks[selectedWeek].startDate);
                    const endDate = new Date(weeks[selectedWeek].endDate);
                    const currentTime = new Date();
                    
                    // Filter out games that have started
                    spreadList = spreadList.filter(game => {
                        const gameDate = new Date(game.date);
                        return (isSameDay(gameDate, startDate) || isAfter(gameDate, startDate))
                            && (isSameDay(gameDate, endDate) || isBefore(gameDate, endDate)
                            && isBefore(currentTime, gameDate));
                    })
                }
                const returnObj = {
                    spreads: spreadList,
                    id: data.id
                };

            res.json(returnObj);
        })
    } catch (error) {
        res.status(400).json('Error: ' + error);
    }
}

export default router;