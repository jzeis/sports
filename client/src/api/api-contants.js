const BASE_URLS = {
  dev: 'http://localhost:5000',
  prod: 'http://api.jzeis.com',
};

export const getBaseUrl = () => {
  console.log('env', process.env);
  const { REACT_APP_ENV } = process.env;
  return BASE_URLS[REACT_APP_ENV];
};
