'use strict';

var utils = require('../../utils');

var decorateRef = function decorateRef(ref) {

  Object.keys(ref.definitions).forEach(function (classname) {
    var definition = ref.definitions[classname];

    Object.keys(definition.properties).forEach(function (propertyName) {
      var property = definition.properties[propertyName];
      if (property.hasOwnProperty('enum')) {
        var enumClassName = classname + utils.capitalize(propertyName);
        ref.definitions[enumClassName] = {
          type: 'enum',
          required: [],
          properties: property.enum.map(function (val) {
            return val.toUpperCase()
          })
        };

        definition.properties[propertyName] = {
          '$ref': '#/definitions/' + enumClassName
        };
      }
    });
  });

};

module.exports = {
  decorateRef: decorateRef
};