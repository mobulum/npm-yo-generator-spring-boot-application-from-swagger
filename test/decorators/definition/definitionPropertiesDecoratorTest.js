'use strict';

const definitionPropertiesDecorator = require('../../../lib/decorators/definition/definitionPropertiesDecorator').decorateDefinition;
const assert = require('yeoman-assert');

describe('decorators:definition:properties definition decorator', function () {

  // given
  const classname = 'ClassName';
  const props = {
    log: console.log
  };

  it('should skip decorate for enum', function () {

    // given
    const definition = {
      type: 'enum'
    };

    // when
    definitionPropertiesDecorator(classname, definition, props);

    // then
    assert.objectContent(definition, {});
  });

  it('should decorate', function () {

    // given
    const definition = {
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
