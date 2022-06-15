import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../../api/index.js';

export default class TeamsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leagues: [],
    };
  }

  componentDidMount() {
    axios.all([API.get('/league'), API.get('/team/all')])
      .then((response) => {
        const leagues = response[0].data;
        const teams = response[1].data;
        const newLeague = leagues.map((league) => ({ ...league, team: teams.find((team) => league.teams.indexOf(team._id) >= 0) }));
        this.setState({ leagues: newLeague });
      });
  }

  render() {
    const { leagues } = this.state;
    return (
      <div>
        <div>
          <Link to="/league/join">Join League</Link>
        </div>

        {leagues.map((league) => (
          <div>
            <div><Link to={`/league/${league._id}`}>{league.leagueName}</Link></div>
            <div><Link to={`/league/${league._id}/team/${league.team._id}`}>{league.team.teamName} - {league.team.balance}</Link></div>
          </div>
        ))}
      </div>
    );
  }
}
