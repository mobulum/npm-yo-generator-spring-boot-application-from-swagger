'use strict';
const querystring = require('querystring');

const decorateOperation = function decorateOperation(operation, path/* , props */) {
  let pathForTest = path;
  const qsParams = {};
  operation.parameters = operation.parameters || [];

  operation.parameters
    .filter(function filter(parameter) {
      return parameter.in === 'path';
    })
    .map(function map(parameter) {
      pathForTest = pathForTest.replace('{' + parameter.name + '}', parameter.default);
      return parameter;
    });

  operation.parameters
    .filter(function filter(parameter) {
      return parameter.in === 'query' || parameter.in === 'formData';
    })
    .filter(function filter(parameter) {
      return parameter.type !== 'file';
    })
    .map(function map(parameter) {
      qsParams[parameter.name] = parameter.default;
      return parameter.name;
    });

  let pathForIntegrationTest = pathForTest;
  const qs = querystring.stringify(qsParams);
  if (qs) {
    pathForIntegrationTest = pathForTest + '?' + qs;
  }

  operation.pathForTest = pathForTest;
  operation.pathForIntegrationTest = pathForIntegrationTest;
};

module.exports = {
  decorateOperation: decorateOperation
};
