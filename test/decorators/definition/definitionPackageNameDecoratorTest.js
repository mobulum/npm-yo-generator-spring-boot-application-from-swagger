'use strict';

var definitionPackageNameDecorator = require('../../../lib/decorators/definition/definitionPackageNameDecorator').decorateDefinition;
var assert = require('yeoman-assert');

describe('decorators:definition:package definition decorator', function () {

  it('should decorate', function () {

    // given
    var classname = 'ClassName';
    var definition = {};
    var props = {
      basePackageName: 'com.mobulum',
      apiSrcDir: 'api/src/main/java/api',
      controllersPackage: 'controller',
      modelPackage: 'model'
    };

    // when
    definitionPackageNameDecorator(classname, definition, props);

    // then
    assert.objectContent(definition, {
      packageName: 'com.mobulum.api.model',
      destination: 'api/src/main/java/api/model/ClassName.java',
      classname: 'ClassName'
    });
  });

});
