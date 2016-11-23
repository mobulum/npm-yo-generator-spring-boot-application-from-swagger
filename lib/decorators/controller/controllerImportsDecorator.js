'use strict';

var decorateController = function decorateController(controller, props) {
  var imports = {};

  controller && controller.routes && controller.routes.forEach(function (route) {
    route.operations && route.operations.forEach(function (operation) {

      var codes = (operation.responses && Object.keys(operation.responses)) || [];
      codes && codes.forEach(function (code) {
        var response = operation.responses[code];
        if (response.responseClassName && ['Integer', 'String', 'Long', 'Boolean', 'Float', 'Decimal'].indexOf(response.responseClassName) === -1) {
          imports[response.responseClassName] = response.responseClassName;
        }
      });
      operation.parameters && operation.parameters.forEach(function (param) {
        if (param.in === 'body') {
          imports[param.paramClass] = param.paramClass;
        }
      })
    })
  });

  controller.imports = Object.keys(imports);
};

module.exports = {
  decorateController: decorateController
};
