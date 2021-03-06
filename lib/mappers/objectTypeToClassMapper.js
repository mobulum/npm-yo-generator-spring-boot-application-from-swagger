'use strict';

const map = function map(type, format, props) {
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
      props.log(`default object for type: ${type}`);
      return 'Object';
  }
};

module.exports = {
  map: map
};
