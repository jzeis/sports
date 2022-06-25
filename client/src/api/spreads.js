import { API } from 'api';

export const getSpreads = (week) => API.get(`/spreads/${week}`);

