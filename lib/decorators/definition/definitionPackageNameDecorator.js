'use strict';
var Path = require('path');

var decorateDefinition = function decorateDefinition(classname, definition, props) {
  definition.packageName = [props.basePackageName, 'api', props.modelPackage].join('.');
  definition.destination = Path.join(props.apiSrcDir, props.modelPackage, classname + '.java')
  definition.classname = classname;
};

module.exports = {
  decorateDefinition: decorateDefinition
};
