'use strict';

var propertyClassNameDecorator = require('../property/propertyClassNameDecorator').decorateProperty;
var propertyRequiredDecorator = require('../property/propertyRequiredDecorator').decorateProperty;

var decorateDefinition = function decorateDefinition(classname, definition, props) {
  if (definition.hasOwnProperty('type')) {
    switch (definition.type) {
      case 'enum':
        break;
      case 'object':
        var lastProperty = Object.keys(definition.properties).pop();
        Object.keys(definition.properties).forEach(function (propertyName) {
          var property = definition.properties[propertyName];

          propertyClassNameDecorator(propertyName, property, definition, props);
          propertyRequiredDecorator(propertyName, property, definition, props);
          property.isLastProperty = (lastProperty === propertyName);
        });
        break;
      default:
        console.log('missing handler for definition.type: ' + definition);
    }
  }
  else {
    console.log('unable to get definition type from: ', definition);
  }
};

module.exports = {
  decorateDefinition: decorateDefinition
};
