'use strict';

const propertyClassNameDecorator = require('../property/propertyClassNameDecorator').decorateProperty;
const propertyRequiredDecorator = require('../property/propertyRequiredDecorator').decorateProperty;

const decorateDefinition = function decorateDefinition(classname, definition, props) {
  if (definition.hasOwnProperty('type')) {
    switch (definition.type) {
      case 'enum': {
        props.log(`skip for enum type: ${definition}`);
        break;
      }
      case 'object': {
        const lastProperty = Object.keys(definition.properties).pop();
        Object.keys(definition.properties).forEach(propertyName => {
          const property = definition.properties[propertyName];

          propertyClassNameDecorator(propertyName, property, definition, props);
          propertyRequiredDecorator(propertyName, property, definition, props);
          property.isLastProperty = (lastProperty === propertyName);
        });
        break;
      }
      default:
        props.log(`missing handler for definition.type: ${definition}`);
    }
  } else {
    props.log(`unable to get definition type from: ${definition}`);
  }
};

module.exports = {
  decorateDefinition: decorateDefinition
};
