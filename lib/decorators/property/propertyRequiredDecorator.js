'use strict';

const decorateProperty = function decorateProperty(propertyName, property, definition/* , props */) {
  let required = [];

  if (definition.hasOwnProperty('required')) {
    required = definition.required;
  }

  property.required = required.indexOf(propertyName) > -1;
};

module.exports = {
  decorateProperty: decorateProperty
};
