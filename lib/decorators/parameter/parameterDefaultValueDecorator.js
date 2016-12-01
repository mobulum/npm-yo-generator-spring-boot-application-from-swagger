'use strict';
var crypto = require('crypto');

var decorateParameter = function decorateParameter(parameter, path, method, i, props) {

  if (parameter.hasOwnProperty('default')) {
    return;
  }

  var defaultValue;

  switch (parameter.type) {
    case 'string':
      defaultValue = crypto.randomBytes(4).toString('hex');
      break;
    case 'integer':
      defaultValue = Math.floor((Math.random() * 100) + 1);
      break;
    default:
      defaultValue = 1; //TODO
  }

  parameter.default = defaultValue;
};

module.exports = {
  decorateParameter: decorateParameter
};
