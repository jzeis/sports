import axios from 'axios';

export const getScores = (week) => { 
    console.log('getting scores for week', week);
    return new Promise((resolve, reject) => {
        try {
            axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`)
                .then(res => {
                    resolve(mapScores(res.data));
                })    
        } catch (error) {
            reject('Error: ' + error);
        }
    })    
}

export const mapScores = (scores) => {
    const games = scores.events.map(event => {
        return event.competitions[0].competitors.map(team => {
            team.status = event.status;
            team.date = event.date;
            team.overUnder = event.competitions[0].odds?.[0].overUnder;
            return team;
        })      
    });
    const gameData = games.map(game => {
        return {
        teams: game.map(team => {
            return {                
            homeAway: team.homeAway,
            displayName: team.team.displayName,
            abbreviation: team.team.abbreviation,
            score: team.score,
            name: team.team.name,
            overUnder: team.overUnder
            }
        }),
        status: game[0]?.status?.type,
        date: game[0]?.date
        }
    })

    return gameData;
}

export const calculateBet = (bet, scores) => {
    for (const score of scores) {
        const teamName = bet.team.split('/')?.[0] || '';
        const betOnTeam = score.teams.find(team => team.displayName === teamName || teamName.indexOf(team.displayName) >= 0);
        if (betOnTeam && score.status.description === 'Final') {
            const opposingTeam = score.teams.find(team => team.displayName !== bet.team);
            switch(bet.type) {
                case 'points':
                    if (+betOnTeam.score + +bet.points === +opposingTeam.score) {
                        bet.result = 'T';
                    } else {
                        bet.result = +betOnTeam.score + +bet.points > +opposingTeam.score ? 'W' : 'L';
                    }
                    bet.processed = true;
                    break;
                case 'under':
                    if (+betOnTeam.score + +opposingTeam.score === bet.points) {
                        bet.result = 'T';
                    } else {
                        bet.result = +betOnTeam.score + +opposingTeam.score < bet.points? 'W' : 'L';
                    }
                    bet.processed = true;
                    break;
                case 'over':
                    if (+betOnTeam.score + +opposingTeam.score === bet.points) {
                        bet.result = 'T';
                    } else {
                        bet.result = +betOnTeam.score + +opposingTeam.score > bet.points? 'W' : 'L';
                    }
                    bet.processed = true;
                    break;
            }
            
            return bet;
        }
    }
    return bet;
  }