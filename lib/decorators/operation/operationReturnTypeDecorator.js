'use strict';

const decorateOperation = function decorateOperation(operation/* , path, props */) {
  let returnType = 'void';
  let responseContainer;
  let responseClass;

  const mappedResponses = [];
  Object.keys(operation.responses).forEach(function forEachCode(code) {
    mappedResponses.push(operation.responses[code]);
  });

  const responses = mappedResponses && mappedResponses
      .filter(function filter(response) {
        return response.returnType !== 'void';
      })
      .filter(function filter(response) {
        return (response.httpStatus >= 200 && response.httpStatus <= 299);
      })
      .sort(function sort(a, b) {
        return a - b;
      });

  if (responses && responses.length > 0) {
    const response = responses[0];

    returnType = response.returnType;
    responseContainer = response.responseContainer;
    responseClass = response.responseClassName;
  }

  operation.returnType = returnType;
  operation.responseContainer = responseContainer;
  operation.responseClass = responseClass;
};

module.exports = {
  decorateOperation: decorateOperation
};
