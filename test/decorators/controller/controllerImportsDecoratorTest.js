'use strict';

const controllerImportsDecorator = require('../../../lib/decorators/controller/controllerImportsDecorator').decorateController;
const assert = require('yeoman-assert');

describe('decorators:controller:imports controller decorator', function () {

  const props = {
    log: console.log
  };

  it('should decorate with empty imports for empty data', function () {

    // given
    const controller = {};

    // when
    controllerImportsDecorator(controller, props);

    // then
    assert.objectContent(controller, {imports: []});
  });

  it('should decorate with imports for operation responses, skipping java Object types', function () {

    // given
    const controller = {
      routes: [
        {
          operations: [
            {
              responses: [
                {
                  responseClassName: 'User'
                },
                {
                  responseClassName: 'Order'
                },
                {
                  responseClassName: 'Order'
                },
                {
                  responseClassName: 'Integer'
                }
              ]
            }
          ]
        }
      ]
    };

    // when
    controllerImportsDecorator(controller, props);

    // then
    assert.objectContent(controller, {imports: ['User', 'Order']});
  });

  it('should decorate with imports for operation body parameters', function () {

    // given
    const controller = {
      routes: [
        {
          operations: [
            {
              parameters: [
                {
                  in: 'body',
                  paramClass: 'User'
                },
                {
                  in: 'path',
                  paramClass: 'String'
                },
                {
                  in: 'body',
                  paramClass: 'Order'
                },
                {
                  in: 'body',
                  paramClass: 'Integer'
                },
                {
                  in: 'query',
                  paramClass: 'Cart'
                }
              ]
            }
          ]
        }
      ]
    };

    // when
    controllerImportsDecorator(controller, props);

    // then
    assert.objectContent(controller, {imports: ['User', 'Order']});
  });

  it('should decorate with imports for operation parameters and responses', function () {

    // given
    const controller = {
      routes: [
        {
          operations: [
            {
              responses: [
                {
                  responseClassName: 'UserResponse'
                },
                {
                  responseClassName: 'OrderResponse'
                },
                {
                  responseClassName: 'OrderResponse'
                },
                {
                  responseClassName: 'Integer'
                }
              ],
              parameters: [
                {
                  in: 'body',
                  paramClass: 'UserParam'
                },
                {
                  in: 'path',
                  paramClass: 'String'
                },
                {
                  in: 'body',
                  paramClass: 'OrderParam'
                },
                {
                  in: 'body',
                  paramClass: 'Integer'
                },
                {
                  in: 'query',
                  paramClass: 'CartParam'
                }
              ]
            }
          ]
        }
      ]
    };

    // when
    controllerImportsDecorator(controller, props);

    // then
    assert.objectContent(controller, {imports: ['UserResponse', 'OrderResponse', 'UserParam', 'OrderParam']});
  });
});
