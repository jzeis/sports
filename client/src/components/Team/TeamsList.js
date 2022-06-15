import { Button } from '@material-ui/core';
import { getLeaguesAndTeams } from 'actions/leagues';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class TeamsList extends Component {
  componentDidMount() {
    const { dispatch, leagues } = this.props;
    if (!leagues?.length) {
      dispatch(getLeaguesAndTeams());
    }
  }

  render() {
    const { allLeagues } = this.props.leagues;

    const teamLinkStyles = {
      color: '#fff',
      fontSize: 18,
    };

    return (
      <div>
        <div>
          {/* <Link to="/league/join">Join League</Link> */}
          <Button component={Link} to="/league/join" variant="contained" color="primary">Join League</Button>
        </div>

        {allLeagues.map((league) => (
          <div key={league._id}>
            <div><Link style={teamLinkStyles} className="teamLink" to={`/league/${league._id}/team/${league.team._id}`}>{league.team.teamName} - {league.team.balance}</Link></div>
            <div><Link className="leagueLink" to={`/league/${league._id}`}>{league.leagueName}</Link></div>
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  leagues: state?.leagues,
});

export default connect(mapStateToProps)(TeamsList);

