import { Container, createTheme, ThemeProvider } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import AuthenticatedRoute from "./components/Auth/AuthenticatedRoute";
import BetList from "./components/Bets/Bets";
import CreateLeague from "./components/League/CreateLeague";
import JoinLeague from "./components/League/JoinLeague";
import TeamsList from "./components/Team/TeamsList";

export const themeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#FDEE30',
    },
    secondary: {
      main: '#f50057',
    },
	// action: {
	// 	// active: '#f7f73b',
	// 	activeOpacity: 1,
	// 	// hover: '#f7f73b',
	// 	hoverOpacity: 0.7,
	// 	focus: '#f7f73b',
	// 	focusOpacity: 1,
	// 	// selected: '#f7f73b',
	// 	selectedOpacity: 1
	//   },
  },
  components: {
	MuiLink: {
		styleOverrides: {
		  root: {
			textDecoration: "none",
			":hover": {
			  textDecoration: "none",
			  color: '#fff',
			},
		  },
		},
	  },
  }
};

const appTheme = createTheme({
	palette: themeOptions.palette,
	components: themeOptions.components
});

const App = () => (
	<ThemeProvider theme={appTheme}>
		<BrowserRouter>
			<Container maxWidth="md">
				{/* <AccountMenu /> */}
				{/* <Navbar /> */}
				<Switch>
					<Route path="/auth" exact component={Auth} />

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
					<AuthenticatedRoute path="/" exact component={TeamsList} />
					<Redirect from="*" to="/" />
				</Switch>
			</Container>
		</BrowserRouter>
	</ThemeProvider>
);

export default App;
