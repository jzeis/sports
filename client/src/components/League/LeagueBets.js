import { Checkbox, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from 'axios';
import BetRow from 'components/Bets/BetRow';
import { isBefore, isEqual } from 'date-fns/esm';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { calculateBets } from 'utilities/betOperations';
import { mapScores } from 'utilities/mapScores';

const LeagueBets = ({bets, league, teams}) => {
  const [scores, setScores] = useState()
  const [hideFinished, setHideFinished] = useState(JSON.parse(sessionStorage.getItem('hideFinished') || 'false'));

  useEffect(() => {
    getScores()
  }, [])

  const getScores = () => {
    axios.get(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
      .then((res) => {
        setScores(mapScores(res.data))
      });
  }

  const standings = () => {
    const sortedTeams = teams.sort((team1, team2) => team2.weekStartBalance - team1.weekStartBalance);
    return (
      sortedTeams.map((team, i) => {
        return <TableRow
              key={team._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell sx={{padding: '0 0 0 5px'}} align="center">{i + 1}</TableCell>
              <TableCell align="left">{team.teamName}</TableCell>
              <TableCell align="center"><CurrencyFormat value={team.weekStartBalance} displayType={'text'} thousandSeparator={true} prefix={'$'}/></TableCell>
              <TableCell align="center">{team.win}-{team.loss}-{team.tie}</TableCell>
              <TableCell align="center">{`${team.weekChange > 0 ? '+' : ''}`}<CurrencyFormat value={team.weekChange} displayType={'text'} thousandSeparator={true} prefix={'$'}/></TableCell>
            </TableRow>
      })
    );
  }; 

  const toggleHideFinished = () => {
    sessionStorage.setItem('hideFinished', `${!hideFinished}`);
    setHideFinished(!hideFinished)
  }

  const betList = () => {
    let leagueBets = bets.map((bet) => ({
      ...bet,
      teamName: teams.find((team) => team._id === bet.teamId)?.teamName,
    }));
    if (scores) {
      [leagueBets] = calculateBets(leagueBets, scores);
    }
    return leagueBets
      .sort((bet1, bet2 ) => {
        const date1 = new Date(bet1.gameDate);
        const date2 = new Date(bet2.gameDate);
        if (!isEqual(date1, date2)) {
          return isBefore(date1, date2) ? -1 : 1;
        } else {
          if (bet1.teamName === bet2.teamName) {
            return 0
          }
          return bet1.teamName > bet2.teamName ? 1 : -1
        } 
      })
      .filter(bet => hideFinished ? bet.gameStatus !== 'Final' : true)
      .map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  };

  return (
    <div className="container container-bg">
      {league?.leagueName && 
        <h1 className='primary-text'>{league.leagueName} <span style={{fontSize: '.8rem', color: '#dad4d4', fontStyle: 'italic'}}>(Weeks {league?.startWeek} - {league?.endWeek})</span></h1>      }
      <h2 className='h4'>Standings</h2>
      <TableContainer sx={{marginBottom: '20px'}} component={Paper}>
        <Table size="small" aria-label="standings">
          <TableHead>
            <TableRow>
            <TableCell sx={{paddingRight: 0}} align="center"></TableCell>
            <TableCell align="left">Team</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">W-L-T</TableCell>
              <TableCell align="center" title='Weekly change'>+/-</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {standings()}
          </TableBody>
        </Table>
      </TableContainer>
      
      <h2 className='h4'>Week {league?.currentWeek} Bets</h2>

      {!!bets.length && <FormControlLabel control={<Checkbox checked={hideFinished} onChange={(e) => setHideFinished(toggleHideFinished)}/>} label="Hide Finished" />}

      {!bets.length && 
        <>
          <p>No active bets for this week</p>
          <p style={{fontSize: '.9rem', fontStyle: 'italic'}}>-Bets from other teams will appear once that game has started.</p>
        </>
      }
      {bets.length > 0 &&
      <table className="bets-table">
        <thead>
          <tr>
            <th className="label" colSpan={2}>Bet</th>
            <th className="label">$</th>
            <th className="label">Date</th>
            <th className="label">Result</th>
            <th className="label">Bettor</th>
          </tr>
        </thead>
        <tbody>
          {betList()}
        </tbody>
      </table>
      }
    </div>
  );
};

export default LeagueBets;
