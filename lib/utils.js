'use strict';

const capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const methodName = function methodName(method) {
  return method.toLowerCase();
};

module.exports = {
  capitalize: capitalize,
  methodName: methodName
};
