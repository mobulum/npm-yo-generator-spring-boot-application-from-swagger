'use strict';

const objectTypeToClassMapper = require('../../mappers/objectTypeToClassMapper').map;
const referenceToClassMapper = require('../../mappers/referenceToClassMapper').map;

const decorateParameter = function decorateParameter(parameter, path, method, i, props) {
  const refParam = props.refApi.paths[path][method].parameters[i];

  let paramClass = null;
  let paramType = null;
  let paramContainer = null;

  switch (refParam.in) {
    case 'body':
    case 'query':
    case 'header':
    case 'formData':
    case 'path':
      if (refParam.hasOwnProperty('type')) {
        switch (refParam.type) {
          case 'array':
            if (refParam.hasOwnProperty('items') && refParam.items.hasOwnProperty('type')) {
              paramClass = objectTypeToClassMapper(refParam.items.type, refParam.items.format, props);
              paramType = `List<${paramClass}>`;
              paramContainer = 'List';
            }
            break;
          default:
            paramClass = objectTypeToClassMapper(refParam.type, refParam.format, props);
            paramType = paramClass;
        }
      } else if (refParam.hasOwnProperty('schema')) {
        if (refParam.schema.hasOwnProperty('$ref')) {
          paramClass = referenceToClassMapper(refParam.schema.$ref);
          paramType = paramClass;
        } else if (refParam.schema.hasOwnProperty('items')) {
          if (refParam.schema.items.hasOwnProperty('$ref')) {
            paramClass = referenceToClassMapper(refParam.schema.items.$ref);
            paramType = paramClass;
          } else if (refParam.schema.items.hasOwnProperty('type')) {
            paramClass = objectTypeToClassMapper(refParam.schema.items.type, refParam.schema.items.format, props);
            paramType = paramClass;
          }

          paramType = `List<${paramClass}>`;
          paramContainer = 'List';
        }
      }
      break;
    default:
      props.log(`not handled return type for: ${parameter}`);
  }

  parameter.paramClass = paramClass;
  parameter.paramType = paramType;
  parameter.paramContainer = paramContainer;
};

module.exports = {
  decorateParameter: decorateParameter
};
