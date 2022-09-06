import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import BetRow from 'components/Bets/BetRow';
import React from 'react';
import CurrencyFormat from 'react-currency-format';

const LeagueBets = ({bets, league, teams}) => {

  const standings = () => {
    const sortedTeams = teams.sort((team1, team2) => team2.weekStartBalance - team1.weekStartBalance);
    return (
      sortedTeams.map((team, i) => {
        return <TableRow
              key={team._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="center">{i + 1}</TableCell>
              <TableCell align="center">{team.teamName}</TableCell>
              <TableCell align="center"><CurrencyFormat value={team.weekStartBalance} displayType={'text'} thousandSeparator={true} prefix={'$'}/></TableCell>
              <TableCell align="center">{team.win}-{team.loss}-{team.tie}</TableCell>
              <TableCell align="center">{team.weekChange}</TableCell>
            </TableRow>
      })
    );
  }; 

  const betList = () => {
    const leagueBets = bets.map((bet) => ({
      ...bet,
      teamName: teams.find((team) => team._id === bet.teamId)?.teamName,
    }));
    return leagueBets.map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
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
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">Team</TableCell>
              <TableCell align="center">Balance</TableCell>
              <TableCell align="center">Record</TableCell>
              <TableCell align="center">Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {standings()}
          </TableBody>
        </Table>
      </TableContainer>
      
      <h2 className='h4'>Week {league?.currentWeek} Bets</h2>
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
      {/* <button type="button" onClick={this.calculateBets}>Calculate bets</button> */}
    </div>
  );
};

export default LeagueBets;
