'use strict';

var referenceToClassMapper = require('../../mappers/referenceToClassMapper').map;
var objectTypeToClassMapper = require('../../mappers/objectTypeToClassMapper').map;

var decorateProperty = function decorateProperty(propertyName, property, definition, props) {
  var className = '';
  var classType = null;
  var containerClass = null;

  if (property.hasOwnProperty('type')) {
    switch (property.type) {
      case 'array':
        if (property.hasOwnProperty('items')) {
          if (property.items.hasOwnProperty('$ref')) {
            className = referenceToClassMapper(property.items.$ref);
          } else if (property.items.hasOwnProperty('type')) {
            className = objectTypeToClassMapper(property.items.type, property.items.format, props);
          }

          classType = 'List<' + className + '>';
          containerClass = 'List';
        } else {
          props.log('not handled property array without items:', property);
        }
        break;
      default:
        className = objectTypeToClassMapper(property.type, property.format, props);
    }
  } else if (property.hasOwnProperty('$ref')) {
    className = referenceToClassMapper(property.$ref);
  } else {
    props.log('missing handler for property:', property);
  }

  property.classname = className;
  property.classType = classType || className;
  property.containerClass = containerClass;
};

module.exports = {
  decorateProperty: decorateProperty
};
