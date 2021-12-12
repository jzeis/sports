import { Container } from '@material-ui/core';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeagueBets from 'components/League/LeagueBets';
import AccountMenu from 'components/Navbar/Menu';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Auth from './components/Auth/Auth';
import BetList from './components/Bets/Bets';
import CreateLeague from './components/League/CreateLeague';
import JoinLeague from './components/League/JoinLeague';
import SpreadsList from './components/Spreads/Spreads';
import Team from './components/Team/Team';
import TeamsList from './components/Team/Teams';

const App = () => (
  <BrowserRouter>
    <Container maxWidth="lg">
      <AccountMenu />
      {/* <Navbar /> */}
      <Switch>
        <Route path="/" exact component={TeamsList} />
        <Route path="/auth" exact component={Auth} />
        <Route path="/league/create" exact component={CreateLeague} />
        <Route path="/league/join" exact component={JoinLeague} />
        <Route path="/teams" exact component={TeamsList} />
        <Route path="/league/:leagueId" exact component={LeagueBets} />
        <Route path="/league/:leagueId/team/:teamId" exact component={Team} />
        <Route path="/league/:leagueId/team/:teamId/spreads" exact component={SpreadsList} />
        <Route path="/league/:leagueId/team/:teamId/bets" exact component={BetList} />
      </Switch>
    </Container>
  </BrowserRouter>
);

export default App;
