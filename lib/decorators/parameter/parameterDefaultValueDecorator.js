'use strict';
const crypto = require('crypto');

const decorateParameter = function decorateParameter(parameter/* , path, method, i, props */) {
  if (parameter.hasOwnProperty('default')) {
    return;
  }

  let defaultValue = 1;

  switch (parameter.type) {
    case 'string':
      defaultValue = crypto.randomBytes(4).toString('hex');
      break;
    case 'integer':
      defaultValue = Math.floor((Math.random() * 100) + 1);
      break;
    default:
      defaultValue = 1;
  }

  parameter.default = defaultValue;
};

module.exports = {
  decorateParameter: decorateParameter
};
