'use strict';

const definitionPackageNameDecorator = require('../../../lib/decorators/definition/definitionPackageNameDecorator').decorateDefinition;
const assert = require('yeoman-assert');

describe('decorators:definition:package definition decorator', function () {

  it('should decorate', function () {

    // given
    const classname = 'ClassName';
    const definition = {};
    const props = {
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
