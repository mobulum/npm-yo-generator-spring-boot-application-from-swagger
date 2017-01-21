'use strict';

const operationTypes = require('../enum/operationTypeEnum').operationTypes;
const methodToOperationMapper = require('./methodToOperationMapper').map;

const map = function map(path, pathObj, props) {
  const route = {
    basePath: (props.api.basePath && props.api.basePath !== '/') ? props.api.basePath : '',
    path: path,
    operations: []
  };

  Object.keys(pathObj).forEach(method => {
    const operationObj = pathObj[method];
    method = method.toLowerCase();

    if (method === 'parameters') {
      props.log(`skip parameters method type for: ${path}`);
    } else if (operationTypes.indexOf(method) !== -1) {
      const operation = methodToOperationMapper(method, path, operationObj, props);
      route.operations.push(operation);
    }
  });

  return route;
};

module.exports = {
  map: map
};
