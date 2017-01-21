'use strict';

const decorateOperation = function decorateOperation(operation, path, props) {
  const codes = (operation.responses && Object.keys(operation.responses)) || [];

  let successStatus = 'HttpStatus.OK';

  const status = codes
    .sort((a, b) => b - a)
    .find(code => ~~code >= 200 && ~~code <= 299);

  if (status) {
    switch (status) {
      case '200':
        successStatus = 'HttpStatus.OK';
        break;
      case '201':
        successStatus = 'HttpStatus.CREATED';
        break;
      case '202':
        successStatus = 'HttpStatus.ACCEPTED';
        break;
      case '204':
        successStatus = 'HttpStatus.NO_CONTENT';
        break;
      default:
        props.log(`not handled default for status: ${status}`);
    }
  }

  operation.successStatus = successStatus;
};

module.exports = {
  decorateOperation: decorateOperation
};
