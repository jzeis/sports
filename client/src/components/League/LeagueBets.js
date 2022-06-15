import { BetRow } from 'components/Bets/BetList.js';
import React from 'react';

const LeagueBets = (props) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     bets: [],
  //     teams: [],
  //     league: {},
  //   };
  // }

  // componentDidMount() {
  //   const { leagueId, teamId } = this.props.match?.params || {};

  //   axios.all([
  //     API.get(`/league/${leagueId}`),
  //     API.get(`/team/league/${leagueId}`),
  //     API.get(`/bet/league/${leagueId}/week`),
  //   ])
  //     .then(([league, teams, bets]) => {
  //       const newBets = bets.data.map((bet) => ({
  //         ...bet,
  //         teamName: teams.data.find((team) => team._id === bet.teamId).teamName,
  //       }));

  //       this.setState({
  //         league: league.data,
  //         teams: teams.data,
  //         bets: newBets,
  //         week: league.data.currentWeek,
  //       });

  //       // this.getScores(league.data.currentWeek);
  //     })
  //     .catch((error) => console.log(error));
  // }

  const standings = () => {
    const { teams } = props;
    const sortedTeams = teams.sort((team1, team2) => team2.weekStartBalance - team1.weekStartBalance);
    return (
      sortedTeams.map((team) => <p key={team._id}>{team.teamName} - {team.weekStartBalance}</p>)
    );
  };

  const betList = () => {
    const { bets, teams } = props;
    const leagueBets = bets.map((bet) => ({
      ...bet,
      teamName: teams.find((team) => team._id === bet.teamId)?.teamName,
    }));
    return leagueBets.map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  };

  const { league } = props;
  return (
    <div className="container container-bg">
      <h2>Standings</h2>
      {standings()}
      <h2>Week {league?.currentWeek} Bets</h2>
      <table className="bets-table">
        <thead>
          <tr>
            <th className="label">Team</th>
            <th className="label">Spread</th>
            <th className="label">Amount</th>
            <th className="label">Game Date</th>
            <th className="label">Result</th>
            <th className="label">Bettor</th>
          </tr>
        </thead>
        <tbody>
          {betList()}
        </tbody>
      </table>
      {/* <button type="button" onClick={this.calculateBets}>Calculate bets</button> */}
    </div>
  );
};

export default LeagueBets;
