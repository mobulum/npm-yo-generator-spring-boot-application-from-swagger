'use strict';

const responseReturnTypeDecorator = require('../decorators/response/responseReturnTypeDecorator').decorateResponse;
const responseHttpStatusDecorator = require('../decorators/response/responseHttpStatusDecorator').decorateResponse;
const parameterReturnTypeDecorator = require('../decorators/parameter/parameterReturnTypeDecorator').decorateParameter;
const parameterDefaultValueDecorator = require('../decorators/parameter/parameterDefaultValueDecorator').decorateParameter;
const operationFileUploadFieldsDecorator = require('../decorators/operation/operationFileUploadFieldsDecorator').decorateOperation;
const operationTestPathDecorator = require('../decorators/operation/operationTestPathDecorator').decorateOperation;
const operationSuccessStatusDecorator = require('../decorators/operation/operationSuccessStatusDecorator').decorateOperation;
const operationReturnTypeDecorator = require('../decorators/operation/operationReturnTypeDecorator').decorateOperation;
const operationMediaTypeDecorator = require('../decorators/operation/operationMediaTypeDecorator').decorateOperation;

const map = function map(method, path, operationObj, props) {
  const operation = {
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
    const lastCode = Object.keys(operation.responses).pop();

    Object.keys(operation.responses).forEach(function forEachResponse(code) {
      responseHttpStatusDecorator(operation.responses[code], path, method, code, props);
      responseReturnTypeDecorator(operation.responses[code], path, method, code, props);
      operation.responses[code].isLastResponse = (code === lastCode);
    });
  }

  if (operation.parameters) {
    // parameters = commonParams.concat(operationObj.parameters);
    Object.keys(operation.parameters).forEach(function forEachParameter(i) {
      const parameter = operation.parameters[i];
      parameterDefaultValueDecorator(parameter, path, method, i, props);
      parameterReturnTypeDecorator(parameter, path, method, i, props);
    });
  }

  operationFileUploadFieldsDecorator(operation, path);
  operationTestPathDecorator(operation, path);
  operationSuccessStatusDecorator(operation, path, props);
  operationReturnTypeDecorator(operation, path);
  operationMediaTypeDecorator(operation, path);

  return operation;
};

module.exports = {
  map: map
};
