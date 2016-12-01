'use strict';

var controllerPackageDecorator = require('../../../lib/decorators/controller/controllerPackageDecorator').decorateController;
var assert = require('yeoman-assert');

describe('decorators:controller:package controller decorator', function () {

  it('should decorate', function () {

    // given
    var controller = {
      classname: 'ClassName'
    };

    var props = {
      basePackageName: 'com.mobulum',
      serviceSrcDir: 'service/src/main/java/service',
      serviceTestDir: 'service/src/test/groovy/service',
      serviceIntegrationTestDir: 'service/src/integrationTest/groovy/service',
      restPackage: 'rest',
      controllersPackage: 'controller',
      modelPackage: 'model'
    };

    // when
    controllerPackageDecorator(controller, props);

    // then
    assert.objectContent(controller, {
      restControllerDestination: 'service/src/main/java/service/rest/controller/ClassName.java',
      restControllerSpecDestination: 'service/src/test/groovy/service/rest/controller/ClassNameSpec.groovy',
      restControllerIntegrationSpecDestination: 'service/src/integrationTest/groovy/service/rest/controller/ClassNameIntegrationSpec.groovy',
      packageName: 'com.mobulum.service.rest.controller',
      modelPackageName: 'com.mobulum.api.model'
    });
  });

});
