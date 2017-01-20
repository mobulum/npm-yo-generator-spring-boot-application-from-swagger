'use strict';

const decorateDefinition = function decorateDefinition(classname, definition/* , props */) {
  let template;
  switch (definition.type) {
    case 'enum':
      template = 'api/Enum.java';
      break;
    default:
      template = 'api/Model.java';
  }

  definition.template = template;
};

module.exports = {
  decorateDefinition: decorateDefinition
};
