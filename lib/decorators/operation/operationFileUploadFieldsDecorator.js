'use strict';

const decorateOperation = function decorateOperation(operation/* , path, props */) {
  const fileUploadFields = operation.parameters && operation.parameters
      .filter(function filter(parameter) {
        return parameter.type === 'file';
      })
      .map(function map(parameter) {
        return parameter.name;
      });

  operation.fileUploadField = fileUploadFields && fileUploadFields.length > 0 ? fileUploadFields[0] : null;
};

module.exports = {
  decorateOperation: decorateOperation
};
