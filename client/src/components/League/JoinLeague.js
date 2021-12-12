import { API } from '../../api/index.js';
import { TextField, Button } from '@material-ui/core';
import React, { Component } from 'react';

export default class JoinLeague extends Component {
    constructor(props) {
      super(props);
      this.state = {
          leagueId: '',
          password: ''
      };
      this.joinLeague = this.joinLeague.bind(this);
    }

    joinLeague() {
        const {leagueId, password} = this.state;
        API.post('http://localhost:5000/team/add', {leagueId, password})
    }

    handleChange(event, inputName) {
        this.setState({[inputName]: event.target.value});
      }
    
    render() {
        return (
            <div>
                <TextField onChange={(e) => this.handleChange(e, 'leagueId')} id="leagueId" label="League Id" variant="outlined" />            
                <TextField onChange={(e) => this.handleChange(e, 'password')} id="password" label="Password" variant="outlined" />

                <Button variant="outlined" onClick={this.joinLeague}>Join League</Button>

            </div>
        )
    }
}
