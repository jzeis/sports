import React from 'react';
import { Redirect, Route } from 'react-router-dom';

export const PrivateRoute = (props) => {
  const token = localStorage.getItem('profile');
  const { location } = props;
  return (
    token ? <Route {...props} /> : <Redirect to={{ pathname: '/auth', state: { from: location } }} />
  );
};
