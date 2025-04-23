export const setSessionItem = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));

export const getSessionItem = (key) => JSON.parse(sessionStorage.getItem(key));
