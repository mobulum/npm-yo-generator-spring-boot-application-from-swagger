'use strict';

var decorateOperation = function decorateOperation(operation, path) {

  // console.dir(operation, {depth: 10});
  // ss;

  // operation.produces = operation.produces && '"' + operation.produces.join('", "') + '"';
  operation.producesString = operation.produces && operation.produces.join(', ');
  // operation.consumes = operation.consumes && '"' + operation.consumes.join('", "') + '"';
  operation.consumesString = operation.consumes && operation.consumes.join(', ');
};

module.exports = {
  decorateOperation: decorateOperation
};
