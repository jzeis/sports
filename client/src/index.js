import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { setupInterceptors } from './api/interceptors.js';
import App from './App';
import './index.css';
import { reducers } from './reducers';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

setupInterceptors(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
