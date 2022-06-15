import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { getTeamBets } from 'actions/bets.js';
import { SET_TEAM_BETS } from 'constants/actionTypes';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { calculateBets } from 'utilities/betOperations.js';
import * as scoresApi from '../../actions/scores';
import { BetRow } from '../Bets/BetList.js';

const Team = (props) => {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     league: {},
  //     team: {},
  //     bets: [],
  //     week: '',
  //     amountWon: '',
  //   };
  //   this.calculateBets = this.calculateBets.bind(this);
  //   this.handleWeekChange = this.handleWeekChange.bind(this);
  // }

  // const { leagues, bets, teams } = useSelector((state) => state);
  const { currentWeek } = props.league;

  const [week, changeWeek] = useState(currentWeek);
  const [amountWon, updateAmountWon] = useState(0);

  const dispatch = useDispatch();
  console.log('Team props', props);

  // componentDidMount() {
  //   const { leagueId, teamId } = this.props.match?.params || this.props || {};

  //   axios.all([API.get(`/league/${leagueId}`), API.get(`/team/${teamId}`), API.get(`/bet/${teamId}`)])
  //     .then(([league, team, bets]) => {
  //       this.setState({
  //         league: league.data,
  //         team: team.data,
  //         bets: bets.data,
  //         week: league.data.currentWeek,
  //       });

  //       // this.calculateBets();
  //       // this.getScores(league.data.currentWeek);
  //       this.getScores(this.state.week);
  //     })
  //     .catch((error) => console.log(error));
  // }
  const getScores = () => {
    dispatch(scoresApi.getScores(week));
  };

  const getBets = () => {
    dispatch(getTeamBets(props.team._id, week));
  };

  useEffect(() => {
    getScores();
    if (!props.bets[week]) {
      getBets();
    }
  }, [week]);

  // const handleWeekChange = (e) => {
  //   changeWeek(e.target.value);
  //   getBets();
  // };

  const betList = () => {
    const { bets } = props;
    return (bets[week] || []).map((currentBet) => <BetRow bet={currentBet} key={currentBet._id} />);
  };

  const calcBets = () => {
    const { bets, scores } = props;
    const [newBets, amt] = calculateBets(bets[week], scores);
    updateAmountWon(amt);
    dispatch({ type: SET_TEAM_BETS, payload: { week, bets: newBets } });

    // this.setState({ bets: newBets, amountWon });
  };

  const weeksSelect = () => {
    const { league } = props;
    const weeks = [];
    for (let i = parseInt(league.startWeek, 10); i <= parseInt(league.endWeek, 10); i += 1) {
      weeks.push(<MenuItem key={i} value={i}>{i}</MenuItem>);
    }

    return weeks;
  };

  const { league, team } = props;
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
          onChange={(e) => changeWeek(e.target.value)}
        >
          {weeksSelect()}
        </Select>
      </FormControl>
      <p>Account Balance: {team.balance}</p>
      <p>Amount Won: {amountWon}</p>

      <div>
        <h2>Week {week} Bets</h2>
        <table className="bets-table">
          <tbody>
            {betList()}
          </tbody>
        </table>
        <button type="button" onClick={calcBets}>Calculate bets</button>
      </div>
    </div>
  );
};

export default Team;
