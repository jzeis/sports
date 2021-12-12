import React, { Component } from 'react';
import { API } from '../../api/index.js';
import axios from 'axios';
import { TextField, Button } from '@material-ui/core';

export default class CreateLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
        leagueName: '',
        password: '',
        startingAmount: ''
    };
    this.createLeague = this.createLeague.bind(this);
  }

  componentDidMount() {    
    API.get('http://localhost:5000/league')
        .then(response => {console.log(response)})
  }

  handleChange(event, inputName) {
    this.setState({[inputName]: event.target.value});
  }

  createLeague(leagueName, password, startingBalance) {
    const data = {
        leagueName,
        password,
        maxTeams: 10,
        startingBalance,
        startWeek: 5,
        endWeek: 10
    }
    API.post('http://localhost:5000/league/add', data)
        .then(response => {console.log(response)})
  }
  

  render() {
      const {leagueName, password, startingAmount} = this.state;
    return (
      <div>
          <p>Create League</p>
          <TextField value={this.state.leagueName} onChange={(e) => this.handleChange(e, 'leagueName')} id="leagueName" label="League Name" variant="outlined" />
          <TextField value={this.state.password} onChange={(e) => this.handleChange(e, 'password')} id="password" label="Password" variant="outlined" />
          <TextField value={this.state.startingAmount} onChange={(e) => this.handleChange(e, 'startingAmount')} id="startingAmount" label="startingAmount" variant="outlined" />
          <Button variant="outlined" onClick={() => this.createLeague(leagueName, password, +startingAmount)}>Create League</Button>
      </div>
    )
  }
}