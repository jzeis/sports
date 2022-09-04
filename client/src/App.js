import { Container, createTheme, ThemeProvider } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import BetList from "./components/Bets/Bets";
import CreateLeague from "./components/League/CreateLeague";
import JoinLeague from "./components/League/JoinLeague";
import TeamsList from "./components/Team/TeamsList";

export const overrides = {
	MuiTab: {
		// general overrides for your material tab component here
		root: {
		  backgroundColor: 'red',
		  '&$selected': {
			backgroundColor: 'blue',
		  }
		},
	  },
}
export const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FDEE30',
    },
    secondary: {
      main: '#f50057',
    },
  },
};

const appTheme = createTheme({
	palette: themeOptions.palette,
});

const App = () => (
	<ThemeProvider theme={appTheme}>
		<BrowserRouter>
			<Container maxWidth="md">
				{/* <AccountMenu /> */}
				{/* <Navbar /> */}
				<Switch>
					<Route path="/auth" exact component={Auth} />

					<AuthenticatedRoute path="/" exact component={TeamsList} />
					<AuthenticatedRoute
						path="/league/create"
						exact
						component={CreateLeague}
					/>
					<AuthenticatedRoute path="/league/join/:leagueId?" exact component={JoinLeague} />
					<AuthenticatedRoute path="/teams" exact component={TeamsList} />
					<AuthenticatedRoute
						path="/league/:leagueId/team/:teamId"
						exact
						component={BetList}
					/>
				</Switch>
			</Container>
		</BrowserRouter>
	</ThemeProvider>
);

export default App;
