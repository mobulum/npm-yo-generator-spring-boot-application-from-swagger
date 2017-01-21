'use strict';

const decorateOperation = function decorateOperation(operation/* , path, props */) {
  let returnType = 'void';
  let responseContainer;
  let responseClass;

  const mappedResponses = [];
  Object.keys(operation.responses).forEach(code => {
    mappedResponses.push(operation.responses[code]);
  });

  const response = mappedResponses && mappedResponses
      .sort((a, b) => a - b)
      .find(response => response.returnType !== 'void' && response.httpStatus >= 200 && response.httpStatus <= 299);

  if (response) {
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
