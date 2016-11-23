'use strict';

var definitionPropertiesDecorator = require('../../../lib/decorators/definition/definitionPropertiesDecorator').decorateDefinition;
var assert = require('yeoman-assert');

describe('decorators:definition:properties definition decorator', function () {

  // given
  var classname = 'ClassName';
  var props = {};

  it('should skip decorate for enum', function () {

    // given
    var definition = {
      type: 'enum'
    };

    // when
    definitionPropertiesDecorator(classname, definition, props);

    // then
    assert.objectContent(definition, {});
  });

  it('should decorate', function () {

    // given
    var definition = {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'integer',
          format: 'int64'
        },
        quantity: {
          type: 'integer',
          format: 'int32'
        }
      }
    };

    // when
    definitionPropertiesDecorator(classname, definition, props);

    // then
    assert.objectContent(definition,
      {
        properties: {
          id: {
            classname: 'Long',
            classType: 'Long',
            // containerClass: null,
            required: true,
            isLastProperty: false
          },
          quantity: {
            classname: 'Integer',
            classType: 'Integer',
            // containerClass: null,
            required: false,
            isLastProperty: true
          }
        }
      }
    );
  });

});
