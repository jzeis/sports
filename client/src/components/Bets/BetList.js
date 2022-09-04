import { API } from 'api';
import axios from 'axios';
import React, { Component } from 'react';
import { calculateBets } from 'utilities/betOperations';
import { mapScores } from 'utilities/mapScores';
import BetRow from './BetRow';


export default class BetList extends Component {
  static processBets() {
    API.put('/bet/process/14')
      .then((res) => console.log('proccessed bets', res));
  }

  constructor(props) {
    super(props);
    this.state = {
      bets: [],
      scores: [],
      amountWon: 0,
      week: '',
    };

    this.calculateBets = this.calculateBets.bind(this);
  }

  componentDidMount() {
    const { leagueId, teamId } = this.props.match?.params || this.props || {};

    axios.all([API.get(`/league/${leagueId}`), API.get(`/team/${teamId}`), API.get(`/bet/${teamId}`)])
      .then(([league, team, bets]) => {
        this.setState({ league: league.data, team: team.data, bets: bets.data });
        this.getScores(league.data.currentWeek);
      })
      .catch((error) => console.log(error));
  }

  getScores(week = 15) {
    axios.get(`https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard`)
      .then((res) => {
        this.setState({ scores: mapScores(res.data) });
        this.calculateBets();
      });
  }

  calculateBets() {
    const { bets, scores } = this.state;
    const [newBets, amountWon] = calculateBets(bets, scores);
    this.setState({ bets: newBets, amountWon });
  }

  betList() {
    const { bets } = this.state;
    return bets.map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  }

  render() {
    const styles = {
      containerStyles: {
        border: '0 solid yellow',
        borderWidth: '1px 0 0 0',
        padding: '20px 8px',
        display: 'grid',
        textAlign: 'center',
        gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
        gridTemplateRows: 'repeat(auto, 1fr)',
        gridGap: '10px',
        gridTemplateAreas:
           `'label1 label2 label3 label4 label5'
           'team spread amount date result'`,
      },
    };

    const { amountWon } = this.state;

    return (
      <div className="container container-bg">
        <p>Amount Won: {amountWon}</p>
        <table className="bets-table">
          <thead>
            <tr>
              <th style={{ gridArea: 'label1' }} className="label">Team</th>
              <th style={{ gridArea: 'label2' }} className="label">Bet</th>
              <th style={{ gridArea: 'label3' }} className="label">Amount</th>
              <th style={{ gridArea: 'label4' }} className="label">Game Date</th>
              <th style={{ gridArea: 'label5' }} className="label">Result</th>
            </tr>
          </thead>
          <tbody>
            {this.betList()}
          </tbody>
        </table>
        <div><button type="button" onClick={this.calculateBets}>Calculate bets</button></div>
        <div><button type="button" onClick={BetList.processBets}>Process bets</button></div>
      </div>
    );
  }
}

