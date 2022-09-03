import * as api from '../api/index.js';
import { ATTEMPT_LOGIN, FAILED_LOGIN, SET_AUTH_DATA } from '../constants/actionTypes';

export const signin = (formData, router) => async (dispatch) => {
  try {
    dispatch({ type: ATTEMPT_LOGIN });

    const { data } = await api.signIn(formData);

    dispatch({ type: SET_AUTH_DATA, data });

    const redirectRoute = router.location?.state?.from?.pathname || '/';
    router.push(redirectRoute);
  } catch (error) {
    dispatch({ type: FAILED_LOGIN });
    console.log(error);
  }
};

export const signup = (formData, router) => async (dispatch) => {
  try {
    const { data } = await api.signUp(formData);

    dispatch({ type: SET_AUTH_DATA, data });

    const redirectRoute = router.location?.state?.from?.pathname || '/';
    router.push(redirectRoute);
  } catch (error) {
    console.log(error);
  }
};
