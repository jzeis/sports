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
      spreadsData: {
        spreads: [],
        id: '',
      },
    };

    this.placeBet = this.placeBet.bind(this);
  }

  componentDidMount() {
    const { leagueId, teamId } = this.props.match?.params || this.props || {};

    axios.all([API.get(`/league/${leagueId}`), API.get(`/team/${teamId}`), API.get(`/bet/${teamId}`)])
      .then(([league, team, bets]) => {
        this.setState({ league: league.data, team: team.data, bets: bets.data });

        API.get(`/spreads/${league.data.currentWeek}`)
          .then((response) => {
            console.log('spreads response', response);
            this.setState({ spreadsData: response.data });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => console.log(error));
  }

  spreadsList() {
    const { team, spreadsData } = this.state;
    return spreadsData.spreads.map((currentGame) => <GameRow game={currentGame} maxBet={team.balance} key={currentGame.id} placeBetFunc={this.placeBet} />);
  }

  placeBet(betObj) {
    const { teamId } = this.props.match?.params || {};
    const { id } = this.state.spreadsData;

    // Get betObj with bet data and add our team id and id for all spreads
    const bet = {
      ...betObj,
      teamId,
      id,
    };

    API.post('/bet/add', bet)
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
