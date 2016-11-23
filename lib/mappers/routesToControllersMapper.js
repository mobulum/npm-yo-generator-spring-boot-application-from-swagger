'use strict';

var utils = require('../utils');

var classNamePrefixFromBasePath = function classNamePrefixFromBasePath(basePath) {
  basePath = basePath.replace('/', '');
  return utils.capitalize(basePath)
};

var map = function map(routes, props) {
  var controllers = {};

  routes && routes.forEach(function (route) {
    // console.dir(route, {depth: 10});
    var classname = utils.capitalize(route.path.replace(/^\/|\/$/g, '').split('/')[0]);

    if (classname.indexOf('-') > -1) {
      var split = classname.split('-');

      classname = split.map(function (elem, i) {
        if (i === 0) {
          return elem;
        }

        return utils.capitalize(elem);
      })
        .join('');
    }

    if (!controllers.hasOwnProperty(classname)) {
      var basePath = (props.api.basePath && props.api.basePath !== '/') ? props.api.basePath : '';

      controllers[classname] = {
        classname: classNamePrefixFromBasePath(basePath) + classname + props.controllerClassSuffix,
        basePath: basePath,
        routes: [],
        methodName: utils.methodName,
        capitalize: utils.capitalize
      };
    }

    controllers[classname].routes.push(route);
  });

  return controllers;
};

module.exports = {
  map: map
};
