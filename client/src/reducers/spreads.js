import { SET_SPREADS } from '../constants/actionTypes';

const defaultSpreadsObj = {
  spreads: [],
};

export default (spreads = defaultSpreadsObj, action) => {
  switch (action.type) {
    case SET_SPREADS:
      return action.payload;
    default:
      return spreads;
  }
};

