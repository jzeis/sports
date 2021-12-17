import { API } from './index.js';

export const setupInterceptors = (store) => {
  API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
      req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
  });

  API.interceptors.response.use((response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('response', response);
    return response;
  }, (error) => {
    if (error.response.status === 401) {
      // dispatch({ type: actionType.LOGOUT });
    //   const history = useHistory();
    //   history.push('/auth');
    }
    console.log('error', error.response.status);
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // return Promise.reject(error);
  });
};
