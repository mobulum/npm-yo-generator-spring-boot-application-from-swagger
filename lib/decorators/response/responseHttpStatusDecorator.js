'use strict';

const decorateResponse = function decorateResponse(response, path, method, code/* , props */) {
  response.httpStatus = code === 'default' ? 200 : ~~code;
};

module.exports = {
  decorateResponse: decorateResponse
};
