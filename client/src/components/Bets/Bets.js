import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { makeStyles } from "@mui/styles";
import { getLeagueBets, getTeamBets } from 'actions/bets';
import { getLeague } from 'actions/leagues';
import { getAllTeamsInLeague, getTeam } from 'actions/teams';
import Balance from 'components/Balance/Balance';
import LeagueBets from 'components/League/LeagueBets';
import SpreadsList from 'components/Spreads/Spreads';
import Team from 'components/Team/Team';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="testing" sx={{ pt: 2 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs(props) {
  const { leagueId, teamId } = props.match.params;

  const [tabIndex, setValue] = useState(0);
  const test = useSelector((state) => state);
  console.log('redux state', test);

  const { leagues, bets, teams, scores } = useSelector((state) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLeague(leagueId));
    dispatch(getLeagueBets(leagueId));
  }, [leagueId]);

  useEffect(() => {
    dispatch(getAllTeamsInLeague(leagueId));
  }, [leagueId, teams.selectedTeam]);

  useEffect(() => {
    dispatch(getTeam(teamId));
    dispatch(getTeamBets(teamId));
  }, [teamId]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const classes = makeStyles((theme) => ({
    indicator: {
      backgroundColor: "yellow",
    },
    tabRoot: {
      "&:hover": {
        color: "yellow",
        opacity: 1
      }
    },
    selectedTab: {
      color: "yellow"
    }
   }));

  return (
    <>
      <Box sx={{ width: '100%', my: '60px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            textColor="inherit" 
            TabIndicatorProps={{
              style: { background: "yellow" }
            }}
            sx={{position: 'fixed', left: 0, top: 0, width: '100%', background: '#121212', zIndex: 1}}
            value={tabIndex}  
            variant="fullWidth"
            onChange={handleChange} 
            aria-label="Team tabs">
            <Tab classes={{ root: classes.tabRoot, selected: classes.selectedTab }} label="League" {...a11yProps(0)} />
            <Tab label="My Bets" {...a11yProps(1)} />
            <Tab label="Spreads" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={tabIndex} index={0}>
          <LeagueBets bets={bets.allBets} teams={teams.allTeams} league={leagues.selectedLeague} {...useParams()} />
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <Team league={leagues.selectedLeague} team={teams.selectedTeam} bets={bets.teamBets} scores={scores} {...useParams()} />
        </TabPanel>
        <TabPanel value={tabIndex} index={2}>
          <SpreadsList league={leagues.selectedLeague} team={teams.selectedTeam} {...useParams()} />
        </TabPanel>
      </Box>
      <Balance balance={teams.selectedTeam?.balance} activeBets={bets.teamBets?.[leagues.selectedLeague?.currentWeek]} />
    </>
  );
}
