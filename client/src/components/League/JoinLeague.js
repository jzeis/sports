import { Alert, AlertTitle, Button, Container, TextField } from '@mui/material';
import { getLeague } from 'api/leagues.js';
import Balance from 'components/Balance/Balance.js';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { API } from '../../api/index.js';


export default function JoinLeague (props) {

  const leagueIdFromRoute = props.match?.params?.leagueId || ''
  const [leagueId, setLeagueId] = useState(leagueIdFromRoute);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [league, setLeague] = useState({})
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    if (leagueId){
      setLoading(true);
      getLeague(leagueId)
        .then(({data}) => {
          setLeague(data);
          setLoading(false)
        })
        .catch(err => {
          setError(err)
        })
    }
  
  }, [])

  const joinLeague = () => {
    setError(false)
    API.post('/team/add', { leagueId, password })
      .then(res => {
        setPassword('');
        setSuccess(true)
        console.log(res)})
      .catch(err => {
        console.log('error', err)
        setError(err.data)
      })
  }


  return (
    <Container>
      {!loading && !success && 
        <>
          <h2>Join League</h2>
          
          {leagueIdFromRoute && <p>Enter password to join the <strong>{league.leagueName}</strong> league.</p>}
          {
            !leagueIdFromRoute && 
            <div className="mb-16">
              <TextField onChange={(e) => setLeagueId(e.target.value)} id="leagueId" label="League Id" variant="standard" />
            </div>
          }
          <div>
            <TextField margin='normal' onChange={(e) => setPassword(e.target.value)} id="password" label="Password" variant="standard" />
          </div>

          <Button color="primary" variant="contained" onClick={joinLeague}>Join League</Button>
        </>
      }
      {error &&
        <Alert severity="error">
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      }
      {success && <Redirect to={'/'}/>}
      <Balance activeBets={null} />
    </Container>
  );
}
