import { Container } from "@material-ui/core";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import AccountMenu from "./components/Navbar/Menu";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import BetList from "./components/Bets/Bets";
import CreateLeague from "./components/League/CreateLeague";
import JoinLeague from "./components/League/JoinLeague";
import TeamsList from "./components/Team/TeamsList";

const App = () => (
	<BrowserRouter>
		<Container maxWidth="lg">
			<AccountMenu />
			{/* <Navbar /> */}
			<Switch>
				<AuthenticatedRoute path="/" exact component={TeamsList} />
				<Route path="/auth" exact component={Auth} />
				<AuthenticatedRoute
					path="/league/create"
					exact
					component={CreateLeague}
				/>
				<AuthenticatedRoute path="/league/join" exact component={JoinLeague} />
				<AuthenticatedRoute path="/teams" exact component={TeamsList} />
				{/* <AuthenticatedRoute path="/league/:leagueId" exact component={LeagueBets} /> */}
				<AuthenticatedRoute
					path="/league/:leagueId/team/:teamId"
					exact
					component={BetList}
				/>
				{/* <AuthenticatedRoute path="/league/:leagueId/team/:teamId/spreads" exact component={SpreadsList} /> */}
				{/* <AuthenticatedRoute path="/league/:leagueId/team/:teamId/bets" exact component={BetList} /> */}
			</Switch>
		</Container>
	</BrowserRouter>
);

export default App;
