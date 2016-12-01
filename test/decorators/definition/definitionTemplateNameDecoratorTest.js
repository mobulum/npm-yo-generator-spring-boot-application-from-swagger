'use strict';

var definitionTemplateNameDecorator = require('../../../lib/decorators/definition/definitionTemplateNameDecorator').decorateDefinition;
var assert = require('yeoman-assert');

describe('decorators:definition:template definition decorator', function () {

  // given
  var classname = 'ClassName';
  var props = {};

  it('should decorate enum', function () {

    // given
    var definition = {
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
    var definition = {
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
