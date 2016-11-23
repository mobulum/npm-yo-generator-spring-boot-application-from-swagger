'use strict';

var map = function map(type, format) {
  format = format || null;

  switch (type) {
    case 'string':
      return 'String';
    case 'boolean':
      return 'Boolean';
    case 'file':
      return 'MultipartFile';
    case 'integer':
      switch (format) {
        case 'int64':
          return 'Long';
        default:
          return 'Integer';
      }
    default:
      console.log('default object for type:', type);
      return 'Object';
  }
};

module.exports = {
  map: map
};
