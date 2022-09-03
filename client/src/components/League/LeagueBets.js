import { BetRow } from 'components/Bets/BetList.js';
import React from 'react';

const LeagueBets = ({bets, league, teams}) => {

  const standings = () => {
    const sortedTeams = teams.sort((team1, team2) => team2.weekStartBalance - team1.weekStartBalance);
    return (
      sortedTeams.map((team) => <p key={team._id}>{team.teamName} - {team.weekStartBalance}</p>)
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
      {league?.leagueName && <h2>{league.leagueName}</h2>}
      <p>Weeks {league?.startWeek} - {league?.endWeek}</p>
      <h3>Standings</h3>
      {standings()}
      <h2>Week {league?.currentWeek} Bets</h2>
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
