'use strict';

var decorateOperation = function decorateOperation(operation, path) {

  var returnType = 'void';
  var responseContainer;
  var responseClass;

  var mappedResponses = [];
  Object.keys(operation.responses).forEach(function (code) {
    mappedResponses.push(operation.responses[code]);
  });

  var responses = mappedResponses && mappedResponses
      .filter(function (response) {
        return response.returnType !== 'void';
      })
      .filter(function (response) {
        return (response.httpStatus >= 200 && response.httpStatus <= 299);
      })
      .sort(function (a, b) {
        return a - b;
      });

  if (responses && responses.length > 0) {
    var response = responses[0];

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
