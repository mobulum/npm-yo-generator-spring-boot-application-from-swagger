'use strict';

var objectTypeToClassMapper = require('../../mappers/objectTypeToClassMapper').map;
var referenceToClassMapper = require('../../mappers/referenceToClassMapper').map;

var decorateResponse = function decorateResponse(response, path, method, code, props) {
  var respReturnType = 'void';
  var responseClassName = null;
  var respContainer = null;

  var refResponse = props.refApi.paths[path][method].responses[code];

  if (refResponse.hasOwnProperty('schema')) {
    var schema = refResponse.schema;

    if (schema.hasOwnProperty('type')) {
      switch (schema.type) {
        case 'object':
          respReturnType = objectTypeToClassMapper(schema.additionalProperties.type, schema.additionalProperties.format, props);
          responseClassName = respReturnType;
          break;
        case 'string':
        case 'boolean':
        case 'file':
        case 'integer':
          respReturnType = objectTypeToClassMapper(schema.type, null, props);
          responseClassName = respReturnType;
          break;
        case 'array':
          // console.dir(schema, {depth: 10});
          if (schema.hasOwnProperty('items')) {
            if (schema.items.hasOwnProperty('$ref')) {
              responseClassName = referenceToClassMapper(schema.items.$ref);
            } else if (schema.items.hasOwnProperty('type')) {
              responseClassName = objectTypeToClassMapper(schema.items.type, schema.items.format, props);
            }

            respReturnType = 'List<' + responseClassName + '>';
            respContainer = 'List';
          }
          break;
        default:
          props.log('not handled schema type for: ', schema);
      }
    } else if (schema.hasOwnProperty('$ref')) {
      respReturnType = referenceToClassMapper(schema.$ref);
      responseClassName = respReturnType;
    }
  }

  response.returnType = respReturnType;
  response.responseContainer = respContainer;
  response.responseClassName = responseClassName;
  response.message = refResponse.description;
};

module.exports = {
  decorateResponse: decorateResponse
};
