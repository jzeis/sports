import { SET_SCORES } from '../constants/actionTypes';

export default (scores = {}, action) => {
  switch (action.type) {
    case SET_SCORES:
      return action.payload;
    default:
      return scores;
  }
};

