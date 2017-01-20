'use strict';

var decorateController = function decorateController(controller/* , props */) {
  var imports = {};
  controller.routes = controller.routes || [];

  controller.routes.forEach(function forEachRoute(route) {
    route.operations = route.operations || [];
    route.operations = route.operations || [];
    route.operations.forEach(function forEachOperation(operation) {
      var codes = (operation.responses && Object.keys(operation.responses)) || [];
      codes.forEach(function forEachCode(code) {
        var response = operation.responses[code];
        if (response.responseClassName && ['Integer', 'String', 'Long', 'Boolean', 'Float', 'Decimal'].indexOf(response.responseClassName) === -1) {
          imports[response.responseClassName] = response.responseClassName;
        }
      });

      operation.parameters = operation.parameters || [];
      operation.parameters.forEach(function forEachParameter(param) {
        if (param.in === 'body') {
          imports[param.paramClass] = param.paramClass;
        }
      });
    });
  });

  controller.imports = Object.keys(imports);
};

module.exports = {
  decorateController: decorateController
};
