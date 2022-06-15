import React from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { GET_AUTH } from '../../constants/actionTypes';

const AuthenticatedRoute = (props) => {
  const { location } = props;
  const dispatch = useDispatch();
  let profileData = useSelector((state) => state.auth?.authData);

  if (!profileData && localStorage.getItem('profile')) {
    dispatch({ type: GET_AUTH });
    // profileData = useSelector((state) => state.auth?.authData);
  }

  profileData = useSelector((state) => state.auth?.authData);

  return (
    profileData ? <Route {...props} /> : <Redirect to={{ pathname: '/auth', state: { from: location } }} />
  );
};

export default connect()(AuthenticatedRoute);
