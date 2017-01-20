'use strict';

const decorateOperation = function decorateOperation(operation, path, props) {
  const codes = (operation.responses && Object.keys(operation.responses)) || [];

  const statuses = codes
    .filter(function filter(code) {
      return (~~code >= 200 && ~~code <= 299);
    })
    .sort(function sort(a, b) {
      return b - a;
    });

  let successStatus = 'HttpStatus.OK';

  if (statuses.length > 0) {
    const status = ~~statuses[0];

    switch (status) {
      case 200:
        successStatus = 'HttpStatus.OK';
        break;
      case 201:
        successStatus = 'HttpStatus.CREATED';
        break;
      case 202:
        successStatus = 'HttpStatus.ACCEPTED';
        break;
      case 204:
        successStatus = 'HttpStatus.NO_CONTENT';
        break;
      default:
        props.log('not handled default for status:', status);
    }
  }

  operation.successStatus = successStatus;
};

module.exports = {
  decorateOperation: decorateOperation
};
