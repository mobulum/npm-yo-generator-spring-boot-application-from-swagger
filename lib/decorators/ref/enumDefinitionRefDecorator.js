'use strict';

const utils = require('../../utils');

const decorateRef = function decorateRef(ref) {
  Object.keys(ref.definitions).forEach(function forEachClassname(classname) {
    const definition = ref.definitions[classname];

    Object.keys(definition.properties).forEach(function forEachPropertyName(propertyName) {
      const property = definition.properties[propertyName];
      if (property.hasOwnProperty('enum')) {
        const enumClassName = classname + utils.capitalize(propertyName);
        ref.definitions[enumClassName] = {
          type: 'enum',
          required: [],
          properties: property.enum.map(function map(val) {
            return val.toUpperCase();
          })
        };

        definition.properties[propertyName] = {
          $ref: '#/definitions/' + enumClassName
        };
      }
    });
  });
};

module.exports = {
  decorateRef: decorateRef
};
