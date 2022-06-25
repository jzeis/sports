import { combineReducers } from 'redux';
import auth from './auth';
import bets from './bets';
import leagues from './league';
import scores from './scores';
import spreads from './spreads';
import teams from './teams';

export const reducers = combineReducers({ auth, leagues, bets, teams, scores, spreads });
