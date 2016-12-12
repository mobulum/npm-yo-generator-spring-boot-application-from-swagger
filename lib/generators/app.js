'use strict';
var mkdirp = require('mkdirp');
var Parser = require('swagger-parser');
var Path = require('path');

var utils = require('../../lib/utils');
var controllerImportsDecorator = require('../../lib/decorators/controller/controllerImportsDecorator').decorateController;
var controllerPackageDecorator = require('../../lib/decorators/controller/controllerPackageDecorator').decorateController;
var enumDefinitionRefDecorator = require('../../lib/decorators/ref/enumDefinitionRefDecorator').decorateRef;
var pathToRouteMapper = require('../../lib/mappers/pathToRouteMapper').map;
var routesToControllersMapper = require('../../lib/mappers/routesToControllersMapper').map;
var definitionPropertiesDecorator = require('../../lib/decorators/definition/definitionPropertiesDecorator').decorateDefinition;
var definitionTemplateNameDecorator = require('../../lib/decorators/definition/definitionTemplateNameDecorator').decorateDefinition;
var definitionPackageNameDecorator = require('../../lib/decorators/definition/definitionPackageNameDecorator').decorateDefinition;

var modules = ['api', 'service'];

var updateConfigPath = function updateConfigPath(props) {
  props.ymlApi = props.apiPath && (Path.extname(props.apiPath) === '.yml' || Path.extname(props.apiPath) === '.yaml');
};

var validateApi = function validateApi(props, done) {
  Parser.validate(props.apiPath, function validate(error, api) {
    if (error) {
      done(error);
      return;
    }

    props.api = api;
    Parser.parse(props.apiPath, function parse(errorRef, refApi) {
      if (errorRef) {
        done(errorRef);
        return;
      }

      props.refApi = refApi;
      done();
    });
  });
};

var validate = function validate(propName) {
  return Boolean(propName);
};

module.exports = {
  prompts: [
    {
      type: 'string',
      name: 'basePackageName',
      message: 'Enter default base package name:',
      default: 'com.mobulum',
      validate: validate
    },
    {
      type: 'string',
      name: 'baseName',
      message: 'Enter base name of app:',
      default: 'app',
      validate: validate
    },
    {
      type: 'string',
      name: 'controllerClassSuffix',
      message: 'Enter controller class suffix:',
      default: 'Controller',
      validate: validate
    },
    {
      name: 'apiPath',
      message: 'Path (or URL) to swagger document:',
      required: true,
      default: 'https://raw.githubusercontent.com/mobulum/example-spring-boot-application-from-swagger/master/pet-store-swagger.json',
      // default: '/Users/zenedith/git/yeoman/generator-spring-boot-application-from-swagger/example/pet-store-swagger.json',
      validate: validate
    }],

  onResponses: function prompt(generator, props, done) {
    // To access props later use generator.props.someAnswer;
    generator.props = props;

    var packageFolder = generator.props.basePackageName.replace(/\./g, '/');
    generator.props.packageFolder = packageFolder;
    generator.props.restPackage = 'rest';
    generator.props.controllersPackage = 'controllers';
    generator.props.modelPackage = 'model';
    generator.props.log = generator.log;

    modules.forEach(function forEachModule(module) {
      generator.props[module + 'SrcDir'] = Path.join(module, 'src/main/java', packageFolder, module);
      generator.props[module + 'ResDir'] = Path.join(module, 'src/main/resources');
      generator.props[module + 'TestDir'] = Path.join(module, 'src/test/groovy', packageFolder, module);
      generator.props[module + 'IntegrationTestDir'] = Path.join(module, 'src/integrationTest/groovy', packageFolder, module);
    });

    // parse and validate the Swagger API entered by the user.
    if (props.apiPath) {
      updateConfigPath(generator.props);
      validateApi(generator.props, done);
    } else {
      done();
    }
  },

  write: function write(generator) {
    modules.forEach(function forEachModule(module) {
      mkdirp(generator.props[module + 'SrcDir']);
      mkdirp(generator.props[module + 'TestDir']);
      mkdirp(generator.props[module + 'IntegrationTestDir']);
      mkdirp(generator.props[module + 'ResDir']);
    });

    generator.copy('.gitignore', '.gitignore');
    generator.copy('settings.gradle', 'settings.gradle');
    generator.copy('build.gradle', 'build.gradle');

    mkdirp('gradle/wrapper');
    generator.copy('gradlew', 'gradlew');
    generator.copy('gradlew.bat', 'gradlew.bat');
    generator.copy('gradle/wrapper/gradle-wrapper.jar', 'gradle/wrapper/gradle-wrapper.jar');
    generator.copy('gradle/wrapper/gradle-wrapper.properties', 'gradle/wrapper/gradle-wrapper.properties');

    generator.template('service/build.gradle', 'service/build.gradle');

    var servicePackageName = [generator.props.basePackageName, 'service'].join('.');

    generator.template(
      'service/Application.java',
      Path.join(generator.props.serviceSrcDir, 'Application.java'),
      {
        packageName: servicePackageName
      }
    );
    generator.template(
      'service/integrationTest/ApplicationIntegrationSpec.groovy',
      Path.join(generator.props.serviceIntegrationTestDir, 'ApplicationIntegrationSpec.groovy'),
      {
        packageName: servicePackageName
      }
    );

    generator.template(
      'service/integrationTest/AbstractRestControllerIntegrationSpec.groovy',
      Path.join(generator.props.serviceIntegrationTestDir, generator.props.restPackage, generator.props.controllersPackage, 'AbstractRestControllerIntegrationSpec.groovy'),
      {
        servicePackageName: servicePackageName,
        packageName: [servicePackageName, generator.props.restPackage, generator.props.controllersPackage].join('.')
      }
    );

    generator.template(
      'api/ErrorInfoResponse.java',
      Path.join(generator.props.apiSrcDir, generator.props.modelPackage, 'ErrorInfoResponse.java'),
      {
        servicePackageName: servicePackageName,
        packageName: [generator.props.basePackageName, 'api', generator.props.modelPackage].join('.')
      }
    );

    generator.template('service/application.yml', generator.props.serviceResDir + '/application.yml');

    generator.copy('api/build.gradle', 'api/build.gradle');

    generator.config.set('basePackageName', generator.props.basePackageName);
    generator.config.set('packageFolder', generator.props.packageFolder);
    generator.config.set('restPackage', generator.props.restPackage);
    generator.config.set('controllersPackage', generator.props.controllersPackage);
  },

  routing: function routing(generator) {
    var routes = [];
    var paths = generator.props.api.paths;

    if (paths) {
      Object.keys(paths).forEach(function forEachPath(path) {
        var route = pathToRouteMapper(path, paths[path], generator.props);
        routes.push(route);
      });
    }

    enumDefinitionRefDecorator(generator.props.refApi);

    Object.keys(generator.props.refApi.definitions).forEach(function forEachDefinition(classname) {
      var definition = generator.props.refApi.definitions[classname];
      definitionPropertiesDecorator(classname, definition, generator.props);
      definitionTemplateNameDecorator(classname, definition, generator.props);
      definitionPackageNameDecorator(classname, definition, generator.props);

      definition.capitalize = utils.capitalize;

      generator.fs.copyTpl(
        generator.templatePath(definition.template),
        generator.destinationPath(definition.destination),
        definition
      );
    });

    var controllers = routesToControllersMapper(routes, generator.props);

    Object.keys(controllers).forEach(function forEachController(classname) {
      var controller = controllers[classname];
      controllerImportsDecorator(controller, generator.props);
      controllerPackageDecorator(controller, generator.props);

      generator.fs.copyTpl(
        generator.templatePath('service/RestController.java'),
        generator.destinationPath(controller.restControllerDestination),
        controller
      );

      generator.fs.copyTpl(
        generator.templatePath('service/test/RestControllerSpec.groovy'),
        generator.destinationPath(controller.restControllerSpecDestination),
        controller
      );

      generator.fs.copyTpl(
        generator.templatePath('service/integrationTest/RestControllerIntegrationSpec.groovy'),
        generator.destinationPath(controller.restControllerIntegrationSpecDestination),
        controller
      );
    });
  }
};
