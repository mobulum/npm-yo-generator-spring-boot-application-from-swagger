'use strict';

var decorateOperation = function decorateOperation(operation/* , path, props */) {
  operation.producesString = operation.produces && operation.produces.join(', ');
  operation.consumesString = operation.consumes && operation.consumes.join(', ');
};

module.exports = {
  decorateOperation: decorateOperation
};
