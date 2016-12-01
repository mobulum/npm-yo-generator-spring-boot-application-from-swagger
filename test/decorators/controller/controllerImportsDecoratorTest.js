'use strict';

var controllerImportsDecorator = require('../../../lib/decorators/controller/controllerImportsDecorator').decorateController;
var assert = require('yeoman-assert');

describe('decorators:controller:imports controller decorator', function () {

  var props = {};

  it('should decorate with empty imports for empty data', function () {

    // given
    var controller = {};

    // when
    controllerImportsDecorator(controller, props);

    // then
    assert.objectContent(controller, {imports: []});
  });

  it('should decorate with imports for operation responses, skipping java Object types', function () {

    // given
    var controller = {
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
    var controller = {
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
    var controller = {
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
