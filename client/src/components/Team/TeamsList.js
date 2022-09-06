import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Button } from '@mui/material';
import { getLeaguesAndTeams } from 'actions/leagues';
import Balance from 'components/Balance/Balance';
import React, { useEffect } from 'react';
import CurrencyFormat from 'react-currency-format';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function TeamsList()  {

  const dispatch = useDispatch();
  const leagues  = useSelector(state => state?.leagues);

  useEffect(() => {
    dispatch(getLeaguesAndTeams());
  }, [])
  // componentDidMount() {
  //   const { dispatch, leagues } = this.props;
  //   if (!leagues?.length) {
  //     dispatch(getLeaguesAndTeams());
  //   }
  // }

    const { allLeagues } = leagues;

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
        
        {!!allLeagues?.length && allLeagues.map((league) => (
          <Link style={teamLinkStyles} className="teamLink" to={`/league/${league._id}/team/${league.team._id}`}>
            <div style={{flex: '1 1 auto'}} key={league._id}>
              <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{league.leagueName}</div>
              <div>Team: {league.team.teamName}
              </div>
              <p style={{marginBottom: 5}}>Balance: <CurrencyFormat value={league.team.balance} displayType={'text'} thousandSeparator={true} prefix={'$'} /></p>
            </div>
            <div style={{flex: '0 0 25%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <ArrowForwardIosIcon color="primary"/>
            </div>
          </Link>
        ))}
        {!allLeagues?.length && <p>You haven't joined any leagues</p>}
        <div>
          {/* <Link to="/league/join">Join League</Link> */}
          <Button sx={{textTransform: 'none'}} component={Link} to="/league/join" variant="contained" color="primary">Join A League</Button>
        </div>
        <Balance activeBets={null} />
     </div>
    );
  
}


