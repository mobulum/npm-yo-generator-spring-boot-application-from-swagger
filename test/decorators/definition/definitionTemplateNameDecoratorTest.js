'use strict';

const definitionTemplateNameDecorator = require('../../../lib/decorators/definition/definitionTemplateNameDecorator').decorateDefinition;
const assert = require('yeoman-assert');

describe('decorators:definition:template definition decorator', function () {

  // given
  const classname = 'ClassName';
  const props = {
    log: console.log
  };

  it('should decorate enum', function () {

    // given
    const definition = {
      type: 'enum'
    };

    // when
    definitionTemplateNameDecorator(classname, definition, props);

    // then
    assert.objectContent(definition, {
      template: 'api/Enum.java'
    });
  });

  it('should decorate object', function () {

    // given
    const definition = {
      type: 'object'
    };

    // when
    definitionTemplateNameDecorator(classname, definition, props);

    // then
    assert.objectContent(definition, {
      template: 'api/Model.java'
    });
  });

});
