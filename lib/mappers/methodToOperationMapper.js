'use strict';

var responseReturnTypeDecorator = require('../decorators/response/responseReturnTypeDecorator').decorateResponse;
var responseHttpStatusDecorator = require('../decorators/response/responseHttpStatusDecorator').decorateResponse;
var parameterReturnTypeDecorator = require('../decorators/parameter/parameterReturnTypeDecorator').decorateParameter;
var parameterDefaultValueDecorator = require('../decorators/parameter/parameterDefaultValueDecorator').decorateParameter;
var operationFileUploadFieldsDecorator = require('../decorators/operation/operationFileUploadFieldsDecorator').decorateOperation;
var operationTestPathDecorator = require('../decorators/operation/operationTestPathDecorator').decorateOperation;
var operationSuccessStatusDecorator = require('../decorators/operation/operationSuccessStatusDecorator').decorateOperation;
var operationReturnTypeDecorator = require('../decorators/operation/operationReturnTypeDecorator').decorateOperation;
var operationMediaTypeDecorator = require('../decorators/operation/operationMediaTypeDecorator').decorateOperation;

var map = function map(method, path, operationObj, props) {

  var operation = {
    path: path,
    name: operationObj.operationId,
    description: operationObj.description,
    summary: operationObj.summary,
    method: method.toUpperCase(),
    parameters: operationObj.parameters,
    responses: operationObj.responses,
    produces: operationObj.produces,
    consumes: operationObj.consumes
  };

  if (operation.responses) {
    var lastCode = Object.keys(operation.responses).pop();

    Object.keys(operation.responses).forEach(function (code) {
      responseHttpStatusDecorator(operation.responses[code], path, method, code, props);
      responseReturnTypeDecorator(operation.responses[code], path, method, code, props);
      operation.responses[code].isLastResponse = (code === lastCode);
    });
  }

  if (operation.parameters) {
    // parameters = commonParams.concat(operationObj.parameters);
    Object.keys(operation.parameters).forEach(function (i) {
      var parameter = operation.parameters[i];
      parameterDefaultValueDecorator(parameter, path, method, i, props);
      parameterReturnTypeDecorator(parameter, path, method, i, props);
    });
  }

  operationFileUploadFieldsDecorator(operation, path);
  operationTestPathDecorator(operation, path);
  operationSuccessStatusDecorator(operation, path);
  operationReturnTypeDecorator(operation, path);
  operationMediaTypeDecorator(operation, path);

  return operation;
};

module.exports = {
  map: map
};
