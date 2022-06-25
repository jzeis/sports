import { SET_SPREADS } from 'constants/actionTypes';
import * as spreadsApi from '../api/spreads';

export const getSpreads = (weekNum) => async (dispatch) => {
  try {
    const spreads = await spreadsApi.getSpreads(weekNum);

    dispatch({ type: SET_SPREADS, payload: spreads.data });
  } catch (error) {
    console.log(error);
  }
};
