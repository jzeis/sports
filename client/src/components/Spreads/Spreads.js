import axios from 'axios';
import React, { Component } from 'react';
import { API } from '../../api/index.js';
import GameRow from './GameRow';

export default class SpreadsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: {},
      team: {},
      spreads: [],
    };

    this.placeBet = this.placeBet.bind(this);
  }

  componentDidMount() {
    const { leagueId, teamId } = this.props.match?.params || this.props || {};

    axios.all([API.get(`/league/${leagueId}`), API.get(`/team/${teamId}`), API.get(`/bet/${teamId}`)])
      .then(([league, team, bets]) => {
        this.setState({ league: league.data, team: team.data, bets: bets.data });

        API.get(`http://localhost:5000/spreads/${league.data.currentWeek}`)
          .then((response) => {
            this.setState({ spreads: response.data });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => console.log(error));
  }

  spreadsList() {
    const { team, spreads } = this.state;
    return spreads.map((currentGame) => <GameRow game={currentGame} maxBet={team.balance} key={currentGame.id} placeBetFunc={this.placeBet} />);
  }

  placeBet(betObj, amount, gameId, date) {
    const { teamId } = this.props.match?.params || {};
    const { team, points, type } = betObj;
    console.log(betObj);
    console.log(this.props);

    const bet = {
      team,
      teamId,
      points: parseInt(points, 10),
      type,
      amount,
      gameDate: date,
      // id
    };

    API.post('http://localhost:5000/bet/add', bet)
      .then(({ data: addedBet }) => {
        const { bets, team } = this.state;
        this.setState({ bets: bets.push(bet), team: { ...team, balance: team.balance - addedBet.amount } });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { league, team } = this.state;
    return (
      <div className="container container-bg">
        <h2>Week {league.currentWeek} Odds</h2>
        <p>Account Balance: {team.balance}</p>
        {this.spreadsList()}
      </div>
    );
  }
}
