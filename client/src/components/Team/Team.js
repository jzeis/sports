import CancelIcon from '@mui/icons-material/Cancel';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableContainer, TextField } from '@mui/material';
import { getTeamBets } from 'actions/bets.js';
import { editeamName } from 'actions/teams';
import BetRow from 'components/Bets/BetRow';
import { SET_TEAM_BETS } from 'constants/actionTypes';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { calculateBets } from 'utilities/betOperations.js';
import * as scoresApi from '../../actions/scores';

const Team = ({bets, league, team, scores}) => {
  const { currentWeek } = league;

  const [week, changeWeek] = useState(currentWeek);
  const [amountWon, updateAmountWon] = useState(0);
  const [isEditting, setIsEditting] = useState(false);
  const [newTeamName, updateTeamName] = useState({value: team.teamName, error: ''});

  const dispatch = useDispatch();
  console.log('Team props', team);

  const getScores = () => {
    dispatch(scoresApi.getScores(week));
  };

  const getBets = () => {
    dispatch(getTeamBets(team._id, week));
  };

  useEffect(() => {
    getScores();
    if (!bets[week]) {
      getBets();
    }
  }, [week]);

  const betList = () => {
    return (bets[week] || []).map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  };

  const calcBets = () => {
    const [newBets, amt] = calculateBets(bets[week], scores);
    updateAmountWon(amt);
    dispatch({ type: SET_TEAM_BETS, payload: { week, bets: newBets } });
  };

  const saveTeamName = async () => {
    if (!newTeamName.value?.length ) {
      updateTeamName({...newTeamName, error: 'Name Required'})
    } else if (newTeamName.value?.length > 20 ) {
      updateTeamName({...newTeamName, error: 'Name is too long'})
    }
    await dispatch(editeamName(team._id, newTeamName.value));
    setIsEditting(false);
  }

  const cancelTeamRename = () => {
    updateTeamName({value: team.teamName, error: ''});
    setIsEditting(false);
  }

  const weeksSelect = () => {
    const weeks = [];
    for (let i = parseInt(league.startWeek, 10); i <= parseInt(league.endWeek, 10); i += 1) {
      weeks.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    return weeks;
  };

  return (
    <div className="container container-bg">
              
      {!isEditting && <h1 className='primary-text'>{team.teamName} 
        <IconButton 
          sx={{marginLeft: '5px'}}
          onClick={() => setIsEditting(true)}
          aria-label="Edit Team"><EditIcon fontSize='small' /></IconButton></h1>
      }
      {isEditting &&
        <div style={{marginBottom: '10px'}}>
          <TextField
            error={!!newTeamName.error}
            helperText={newTeamName.error}
            id="editTeamName"
            label="Edit Team Name"
            value={newTeamName.value}
            inputProps={{ max: 20 }}
            variant="standard"
            onChange={(e) => updateTeamName({...newTeamName, value: e.target.value})}
          />
          <IconButton onClick={() => saveTeamName()}><CheckIcon color="primary" /></IconButton>
          <IconButton onClick={cancelTeamRename}><CancelIcon /></IconButton>
        </div>
      }
      
      <FormControl variant='standard'>
        <InputLabel id="week-selector">Week</InputLabel>
        <Select
          labelId="week-selector"
          id="week-select"
          value={week}
          label="Week"
          onChange={(e) => changeWeek(e.target.value)}
        >
          {weeksSelect()}
        </Select>
      </FormControl>
      {/* <p>Amount Won: {amountWon}</p> */}

      <div>
        <h2 className='h4'>Week {week} Bets</h2>
        {!bets?.[week]?.length && <p style={{fontStyle:'italic', fontSize: '.8rem'}}>-You havent placed any bets for week {week}</p>}
        <TableContainer sx={{marginBottom: '20px'}} component={Paper}>
        <Table size="small" aria-label="standings">
          
          <TableBody>
            {betList()}
          </TableBody>
        </Table>
      </TableContainer>

        {/* <button type="button" onClick={calcBets}>Calculate bets</button> */}
      </div>
    </div>
  );
};

export default Team;
