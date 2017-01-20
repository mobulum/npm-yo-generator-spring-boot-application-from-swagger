'use strict';

const utils = require('../utils');

const classNamePrefixFromBasePath = function classNamePrefixFromBasePath(basePath) {
  basePath = basePath.replace('/', '');
  return utils.capitalize(basePath);
};

const map = function map(routes, props) {
  routes = routes || [];
  const controllers = {};

  routes.forEach(function forEachRoute(route) {
    let classname = utils.capitalize(route.path.replace(/^\/|\/$/g, '').split('/')[0]);

    if (classname.indexOf('-') > -1) {
      const split = classname.split('-');

      classname = split.map(function map(elem, i) {
        if (i === 0) {
          return elem;
        }

        return utils.capitalize(elem);
      })
        .join('');
    }

    if (!controllers.hasOwnProperty(classname)) {
      const basePath = (props.api.basePath && props.api.basePath !== '/') ? props.api.basePath : '';

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
