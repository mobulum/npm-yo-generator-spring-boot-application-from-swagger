'use strict';
const Path = require('path');

const decorateController = function decorateController(controller, props) {
  controller.restControllerDestination = Path.join(props.serviceSrcDir, props.restPackage, props.controllersPackage, controller.classname + '.java');
  controller.restControllerSpecDestination = Path.join(props.serviceTestDir, props.restPackage, props.controllersPackage, controller.classname + 'Spec.groovy');
  controller.restControllerIntegrationSpecDestination = Path.join(props.serviceIntegrationTestDir, props.restPackage, props.controllersPackage, controller.classname + 'IntegrationSpec.groovy');
  controller.packageName = [props.basePackageName, 'service', props.restPackage, props.controllersPackage].join('.');
  controller.modelPackageName = [props.basePackageName, 'api', props.modelPackage].join('.');
};

module.exports = {
  decorateController: decorateController
};
