const logger = (param) => (store) => (next) => (action) => {
  console.log("Logging on", param);
  // console.log("Store", store);
  // console.log("next", next);
  // console.log("action", action);
  return next(action);
};

export default logger;
