import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@mui/material';
import { getLeaguesAndTeams } from 'actions/leagues';
import React, { Component } from 'react';
import CurrencyFormat from 'react-currency-format';
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
      textDecoration: 'none',
      border: '1px solid yellow',
      padding: '5px 10px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      margin: '20px 0',
      borderRadius: 5,
      background: '#121212'
    };

    return (
      <div>
        
        {!!allLeagues.length && allLeagues.map((league) => (
          <Link style={teamLinkStyles} className="teamLink" to={`/league/${league._id}/team/${league.team._id}`}>
            <div style={{flex: '1 1 auto'}} key={league._id}>
              <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{league.leagueName}</div>
              <div>Team: {league.team.teamName}</div>
              <p>Balance: <CurrencyFormat value={league.team.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
            </div>
            <div style={{flex: '0 0 25%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <ArrowForwardIosIcon color="primary"/>
            </div>
          </Link>
        ))}
        {!allLeagues.length && <p>You haven't joined any leagues</p>}
        <div>
          {/* <Link to="/league/join">Join League</Link> */}
          <Button component={Link} to="/league/join" variant="contained" color="primary">Join League</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  leagues: state?.leagues,
});

export default connect(mapStateToProps)(TeamsList);

