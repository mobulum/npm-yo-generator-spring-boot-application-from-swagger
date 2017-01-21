'use strict';
const querystring = require('querystring');

const decorateOperation = function decorateOperation(operation, path/* , props */) {
  let pathForTest = path;
  const qsParams = new Map();

  operation.parameters = operation.parameters || [];

  operation.parameters.forEach(parameter => {
    if (parameter.in === 'path') {
      pathForTest = pathForTest.replace(`{${parameter.name}}`, parameter.default);
    }
  });

  operation.parameters.forEach(parameter => {
    if (parameter.type !== 'file' && (parameter.in === 'query' || parameter.in === 'formData')) {
      qsParams[parameter.name] = parameter.default;
    }
  });

  let pathForIntegrationTest = pathForTest;
  const qs = querystring.stringify(qsParams);
  if (qs) {
    pathForIntegrationTest = `${pathForTest}?${qs}`;
  }

  operation.pathForTest = pathForTest;
  operation.pathForIntegrationTest = pathForIntegrationTest;
};

module.exports = {
  decorateOperation: decorateOperation
};
