const BASE_URLS = {
  dev: 'http://localhost:5000',
  prod: 'https://api.jzeis.com',
};

export const getBaseUrl = () => {
  const { REACT_APP_ENV } = process.env;
  return BASE_URLS[REACT_APP_ENV];
};
