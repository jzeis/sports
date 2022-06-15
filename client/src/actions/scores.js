import { SET_SCORES } from 'constants/actionTypes';
import { mapScores } from 'utilities/mapScores';
import * as scoresApi from '../api/scores';

export const getScores = (weekNum) => async (dispatch) => {
  try {
    const scores = await scoresApi.getScores(weekNum);
    const mappedScores = mapScores(scores.data);

    dispatch({ type: SET_SCORES, payload: mappedScores });
  } catch (error) {
    console.log(error);
  }
};
