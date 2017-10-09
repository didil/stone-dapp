var _ = require("lodash");

// https://ethereum.stackexchange.com/questions/15353/how-to-listen-for-contract-events-in-javascript-tests

module.exports = function (contract, filter) {
  return new Promise((resolve, reject) => {
    var event = contract[filter.event]();
    event.get((error, logs) => {
      var filteredLogs = _.filter(logs, filter);
      resolve(filteredLogs);
    });
    event.stopWatching();
  })
};

