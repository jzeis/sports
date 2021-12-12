import express from 'express';
import { isAfter, isBefore, isSameDay } from 'date-fns';
import { getWeeksObj } from '../utilities/weeks.js';


const router = express.Router();
const weeks = getWeeksObj;

export const getLeagueInfo = async (req, res) => { 
    try {
        const startDate = new Date(weeks[selectedWeek].startDate);
        const endDate = new Date(weeks[selectedWeek].endDate);

        const filteredSpreadList = spreadList.filter(game => {
            const gameDate = new Date(game.commence_time);
            return (isSameDay(gameDate, startDate) || isAfter(gameDate, startDate))
                && (isSameDay(gameDate, endDate) || isBefore(gameDate, endDate));
        })
        
    } catch (error) {
        res.status(400).json('Error: ' + err);
    }
}

export default router;