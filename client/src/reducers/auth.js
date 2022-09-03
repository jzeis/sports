import * as actionType from '../constants/actionTypes';

const defaultState = {
  loading: false,
  errors: null,
  authData: null
}

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case actionType.INIT_AUTH:
      return { ...state, authData: JSON.parse(localStorage.getItem('profile')) };
    case actionType.ATTEMPT_LOGIN:
      return { ...state, loading: true, errors: null };
    case actionType.FAILED_LOGIN:
      return { ...state, loading: false, errors: 'Invalid password' };
    case actionType.SET_AUTH_DATA:
      localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
      return { ...state, authData: action.data, loading: false, errors: null };
    case actionType.LOGOUT:
      localStorage.clear();
      return { ...state, authData: null, loading: false, errors: null };
    default:
      return state;
  }
};

export default authReducer;
