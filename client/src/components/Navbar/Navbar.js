import { AppBar, Avatar, Button, List, ListItem, Toolbar, Typography } from '@material-ui/core';
import decode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import * as actionType from '../../constants/actionTypes';
import useStyles from './styles';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();

  dispatch({ type: actionType.INIT_AUTH });

  const logout = () => {
    dispatch({ type: actionType.LOGOUT });

    history.push('/auth');

    setUser(null);
  };

  useEffect(() => {
    const token = user?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem('profile')));
    console.log('user set', user);
  }, [location]);

  return (
    <AppBar className={classes.appBar} position="static" color="inherit">
      <div className={classes.brandContainer}>
        <Typography component={Link} to="/" className={classes.heading} variant="h2" align="center">Pick Em</Typography>
      </div>
      <Toolbar className={classes.toolbar}>
        {user?.result ? (
          <div style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
            <List style={{ display: 'flex', flexDirection: 'row', padding: 0 }}>
              <ListItem button>League</ListItem>
              <ListItem button>My Team</ListItem>
              <ListItem button>My Bets</ListItem>
            </List>
            <Avatar className={classes.purple} alt={user?.result.name} src={user?.result.imageUrl}>{user?.result.name.charAt(0)}</Avatar>
            {/* <Typography className={classes.userName} variant="h6">{user?.result.name}</Typography> */}
            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button component={Link} to="/auth" variant="contained" color="primary">Sign In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
