import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@material-ui/core';
import { getCurrentWeek } from 'api/leagues.js';
import React, { Component } from 'react';
import { API } from '../../api/index.js';

export default class CreateLeague extends Component {
  initialState = {
    leagueName: '',
    password: '',
    startingBalance: '',
    startWeek: '',
    endWeek: '',
    loading: false,
    currentWeek: ''
  };

  constructor(props) {
    super(props);
    this.state = this.initialState;
    this.createLeague = this.createLeague.bind(this);
  }

  componentDidMount() {
    this.setState({...this.state, loading: true})
    getCurrentWeek()
      .then(({data}) => { 
        this.setState({...this.state, currentWeek: data, loading: false}) 
      });
  }

  handleChange(event, inputName) {
    this.setState({ [inputName]: event.target.value });
  }

  createLeague() {
    const {leagueName, password, maxTeams, startingBalance, startWeek, endWeek} = this.state;
    const data = {
      leagueName,
      password,
      maxTeams: 10,
      startingBalance,
      startWeek,
      endWeek
    };
    API.post('/league/add', data)
      .then((response) => { console.log(response); });
  }

  createWeekOptions(start = 1, end = 17) {
    console.log('start', start)
    const weeks = [];
    for (let i = start; i <= end; i += 1) {
      weeks.push(<MenuItem key={`startWeek-${i}`} value={i}>{i}</MenuItem>);
    }
    return weeks;
  }

  leagueAddedSuccesfully() {
    this.setState({...this.initialState, currentWeek: this.state.currentWeek});
  }

  render() {
    const inputContainerStyles = {
      marginBottom: 16
    }
    const lastWeek = 17;
    const { leagueName, password, startingBalance, startWeek, endWeek, currentWeek, loading } = this.state;
    console.log('current week', currentWeek)
    return (
      <Paper elevation={3} sx={{px: 10}}>
        <h2>Create League</h2>
        <div style={inputContainerStyles}>
          <TextField value={this.state.leagueName} onChange={(e) => this.handleChange(e, 'leagueName')} id="leagueName" label="League Name" variant="standard" />
        </div>
        <div style={inputContainerStyles}>
          <TextField value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} id="password" label="Password" variant="standard" />
        </div>
        <div style={inputContainerStyles}>
          <TextField value={this.state.startingBalance} onChange={(e) => this.handleChange(e, 'startingBalance')} id="startingBalance" label="Starting Amount" variant="standard" placeholder='10000' />
        </div>
        <FormControl>
          <InputLabel id="week-selector">Start Week</InputLabel>
          { !loading && 
            <Select
              labelId="start-week-selector"
              id="start-week-select"
              value={startWeek}
              defaultValue={currentWeek}
              label="Start Week"
              onChange={(e) => this.setState({...this.state, startWeek: e.target.value})}
            >
              {this.createWeekOptions(+currentWeek, lastWeek)}
            </Select>}
      </FormControl>

      <FormControl>
          <InputLabel id="week-selector">End Week</InputLabel>
          { !loading && 
            <Select
              labelId="end-week-selector"
              id="end-week-select"
              value={endWeek}
              label="End Week"
              onChange={(e) => this.setState({...this.state, endWeek: e.target.value})}
            >
              {this.createWeekOptions(+startWeek + 1, lastWeek)}
            </Select>}
      </FormControl>

        <Button fullWidth variant="contained" color="primary"  onClick={this.createLeague}>Create League</Button>
      </Paper>
    );
  }
}
