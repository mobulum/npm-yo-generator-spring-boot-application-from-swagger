'use strict';

const decorateController = function decorateController(controller/* , props */) {
  const imports = new Map();
  controller.routes = controller.routes || [];

  controller.routes.forEach(route => {
    route.operations = route.operations || [];
    route.operations = route.operations || [];
    route.operations.forEach(operation => {
      const codes = (operation.responses && Object.keys(operation.responses)) || [];
      codes.forEach(code => {
        const response = operation.responses[code];
        if (response.responseClassName && ['Integer', 'String', 'Long', 'Boolean', 'Float', 'Decimal'].indexOf(response.responseClassName) === -1) {
          imports[response.responseClassName] = response.responseClassName;
        }
      });

      operation.parameters = operation.parameters || [];
      operation.parameters.forEach(param => {
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
