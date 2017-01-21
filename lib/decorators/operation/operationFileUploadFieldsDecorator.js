'use strict';

const decorateOperation = function decorateOperation(operation/* , path, props */) {
  const fileParameter = operation.parameters && operation.parameters
      .find(parameter => parameter.type === 'file');

  operation.fileUploadField = fileParameter ? fileParameter.name : null;
};

module.exports = {
  decorateOperation: decorateOperation
};
