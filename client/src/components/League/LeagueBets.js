import axios from 'axios';
import { BetRow } from 'components/Bets/BetList.js';
import React, { Component } from 'react';
import { API } from '../../api/index.js';

export default class LeagueBets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bets: [],
      teams: [],
      league: {},
    };
  }

  componentDidMount() {
    const { leagueId, teamId } = this.props.match?.params || {};

    axios.all([
      API.get(`/league/${leagueId}`),
      API.get(`/team/league/${leagueId}`),
      API.get(`/bet/league/${leagueId}/week`),
    ])
      .then(([league, teams, bets]) => {
        const newBets = bets.data.map((bet) => ({
          ...bet,
          teamName: teams.data.find((team) => team._id === bet.teamId).teamName,
        }));

        this.setState({
          league: league.data,
          teams: teams.data,
          bets: newBets,
          week: league.data.currentWeek,
        });

        // this.getScores(league.data.currentWeek);
      })
      .catch((error) => console.log(error));
  }

  standings() {
    const { teams } = this.state;
    const sortedTeams = teams.sort((team1, team2) => team2.weekStartBalance - team1.weekStartBalance);
    return (
      sortedTeams.map((team) => <p key={team._id}>{team.teamName} - {team.weekStartBalance}</p>)
    );
  }

  betList() {
    const { bets } = this.state;
    return bets.map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  }

  render() {
    const { week } = this.state;
    return (
      <div className="container container-bg">
        <h2>Standings</h2>
        {this.standings()}
        <h2>Week {week} Bets</h2>
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
            {this.betList()}
          </tbody>
        </table>
        {/* <button type="button" onClick={this.calculateBets}>Calculate bets</button> */}
      </div>
    );
  }
}
