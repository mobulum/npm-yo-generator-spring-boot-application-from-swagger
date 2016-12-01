'use strict';

var operationTypes = require('../enum/operationTypeEnum').operationTypes;
var methodToOperationMapper = require('./methodToOperationMapper').map;

var map = function map(path, pathObj, props) {
  var route = {
    basePath: (props.api.basePath && props.api.basePath !== '/') ? props.api.basePath : '',
    path: path,
    operations: []
  };

  Object.keys(pathObj).forEach(function (method) {
    var operationObj = pathObj[method];
    method = method.toLowerCase();

    if (method === 'parameters') {
      console.log('skip parameters method type for: ', path)
    } else if (operationTypes.indexOf(method) !== -1) {
      var operation = methodToOperationMapper(method, path, operationObj, props);
      route.operations.push(operation);
    }
  });

  return route;
};

module.exports = {
  map: map
};
