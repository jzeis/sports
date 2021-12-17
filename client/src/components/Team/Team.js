import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../api/index.js';
import { calculateBets } from '../../utilities/betOperations.js';
import { mapScores } from '../../utilities/mapScores.js';
import { BetRow } from '../Bets/BetList.js';

export default class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      league: {},
      team: {},
      bets: [],
      week: '',
      amountWon: '',
    };
    this.calculateBets = this.calculateBets.bind(this);
    this.getOdds = this.getOdds.bind(this);
    this.handleWeekChange = this.handleWeekChange.bind(this);
  }

  componentDidMount() {
    const { leagueId, teamId } = this.props.match?.params || {};

    axios.all([API.get(`/league/${leagueId}`), API.get(`/team/${teamId}`), API.get(`/bet/${teamId}`)])
      .then(([league, team, bets]) => {
        this.setState({
          league: league.data,
          team: team.data,
          bets: bets.data,
          week: league.data.currentWeek,
        });

        // this.getScores(league.data.currentWeek);
        this.getScores(15);
      })
      .catch((error) => console.log(error));
  }

  handleWeekChange(e) {
    this.setState({ week: e.target.value });
    this.getBets(e.target.value);
  }

  getScores(week) {
    axios.get(`http://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?week=${week}`)
      .then((res) => this.setState({ scores: mapScores(res.data) }));
  }

  // eslint-disable-next-line class-methods-use-this
  getOdds() {
    // An api key is emailed to you when you sign up to a plan
    // Get a free API key at https://api.the-odds-api.com/
    const apiKey = '0431c6ebd89b9549f0e367b11279c045';

    const sportKey = 'americanfootball_nfl'; // use the sport_key from the /sports endpoint below, or use 'upcoming' to see the next 8 games across all sports

    const regions = 'us'; // uk | us | eu | au. Multiple can be specified if comma delimited

    const markets = 'spreads'; // h2h | spreads | totals. Multiple can be specified if comma delimited

    const oddsFormat = 'decimal'; // decimal | american

    const dateFormat = 'iso'; // iso | unix

    axios.get(`https://api.the-odds-api.com/v4/sports/${sportKey}/odds`, {
      params: {
        apiKey,
        regions,
        markets,
        oddsFormat,
        dateFormat,
      },
    })
      .then((response) => {
        // response.data.data contains a list of live and
        //   upcoming events and odds for different bookmakers.
        // Events are ordered by start time (live events are first)

        // Check your usage
        console.log('Remaining requests', response.headers['x-requests-remaining']);
        console.log('Used requests', response.headers['x-requests-used']);
        console.log(response.data);
        // const mapped = mapSpreadsObject(response.data);

        // console.log('mapped object', mapped);
        // saveSpreads(JSON.stringify(mapped));
      });
  }

  getBets(week) {
    const { teamId } = this.props.match?.params || {};
    API.get(`/bet/${teamId}/${week}`)
      .then((bets) => {
        this.setState({ bets: bets.data });
      });
  }

  betList() {
    const { bets } = this.state;
    return bets.map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  }

  calculateBets() {
    const { bets, scores } = this.state;
    const [newBets, amountWon] = calculateBets(bets, scores);
    this.setState({ bets: newBets, amountWon });
  }

  weeksSelect() {
    const { league } = this.state;
    const weeks = [];
    for (let i = parseInt(league.startWeek, 10); i <= parseInt(league.endWeek, 10); i += 1) {
      weeks.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    return weeks;
  }

  render() {
    const { league, team, amountWon, week } = this.state;
    return (
      <div className="container container-bg">
        <div><Link to={`/league/${league._id}/team/${team._id}/spreads`}>Add bets</Link></div>
        <div><Link to={`/league/${league._id}/team/${team._id}/bets`}>View bets</Link></div>
        <h1>{team.teamName}</h1>
        <FormControl>
          <InputLabel id="week-selector">Week</InputLabel>
          <Select
            labelId="week-selector"
            id="week-select"
            value={week}
            label="Week"
            onChange={this.handleWeekChange}
          >
            {this.weeksSelect()}
          </Select>
        </FormControl>
        <p>Account Balance: {team.balance}</p>
        <p>Amount Won: {amountWon}</p>

        <div>
          <h2>Week {week} Bets</h2>
          <table className="bets-table">
            <tbody>
              {this.betList()}
            </tbody>
          </table>
          <button type="button" onClick={this.calculateBets}>Calculate bets</button>
          <button type="button" onClick={this.getOdds}>get odds</button>
        </div>
      </div>
    );
  }
}
