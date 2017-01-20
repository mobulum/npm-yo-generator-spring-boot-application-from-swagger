'use strict';

const map = function map(ref) {
  return ref.split('/').slice(-1).pop();
};

module.exports = {
  map: map
};
