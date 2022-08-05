import Spreads from '../models/spreads.js';
import { getWeekNumber } from './weeks.js';

// An api key is emailed to you when you sign up to a plan
// Get a free API key at https://api.the-odds-api.com/
// const apiKey = '0431c6ebd89b9549f0e367b11279c045'

// const sportKey = 'americanfootball_nfl' // use the sport_key from the /sports endpoint below, or use 'upcoming' to see the next 8 games across all sports

// const regions = 'us' // uk | us | eu | au. Multiple can be specified if comma delimited

// const markets = 'spreads' // h2h | spreads | totals. Multiple can be specified if comma delimited

// const oddsFormat = 'decimal' // decimal | american

// const dateFormat = 'iso' // iso | unix

/*
    First get a list of in-season sports
        the sport 'key' from the response can be used to get odds in the next request

*/

// axios.get('https://api.the-odds-api.com/v4/sports', {
//     params: {
//         apiKey
//     }
// })
// .then(response => {
//     console.log(response.data)
// })
// .catch(error => {
//     console.log('Error status', error.response.status)
//     console.log(error.response.data)
// })

// export const fetchSpreads = () => {
//     axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
//         params: {
//             apiKey,
//             regions,
//             markets,
//             oddsFormat,
//             dateFormat,
//         }
//     })
//     .then(response => {
//         // response.data.data contains a list of live and 
//         //   upcoming events and odds for different bookmakers.
//         // Events are ordered by start time (live events are first)

//         // Check your usage
//         console.log('Remaining requests',response.headers['x-requests-remaining'])
//         console.log('Used requests',response.headers['x-requests-used'])

//         const mapped = mapSpreadsObject(response.data);

//         console.log('mapped object', mapped);
//         saveSpreads(JSON.stringify(mapped));
//     }) 
//     .catch(error => {
//         console.log('Error status', error)
//         console.log(error.response?.data)
//     }) 
// }


export const saveSpreads = async (spreads) => {
	console.log('attempting to save', typeof spreads);
	const week = await getWeekNumber();
	const newSpreads = {
		spreads: spreads,
		name: `week${week}-spreads`,
		id: new Date().getTime().toString()
	};

	const query = { name: newSpreads.name };
	const update = { $set: newSpreads};
	const options = { upsert: true };
	Spreads.updateOne(query, update, options)
		.then(() => console.log('saved'))
		.catch(err => console.log('Error: ' + err));
};

export const mapSpreadsObject = (spreads) => {
	return spreads.map(spread => {
		const selectedBookmakerKey = 'unibet';
		const backupBookmakerKey = 'bovada';
		const bookmakers = spread.bookmakers;
		const selectedBookmaker = bookmakers.find(bookmaker => {
			return bookmaker.key === selectedBookmakerKey;
		});
		if (!selectedBookmaker) {
			console.log('no bookmaker', bookmakers); 
		}
		const spreadsObject = selectedBookmaker?.markets?.find(market => market.key === 'spreads')?.outcomes
			.map(teamObj => ({name: teamObj.name, points: teamObj.point}));
        
		return {
			away_team: spread.away_team,
			commence_time: spread.commence_time,
			home_team: spread.home_team,
			id: spread.id,
			sport_key: spread.sport_key,
			sport_title: spread.sport_title,
			spreads: spreadsObject
		};
	});
};