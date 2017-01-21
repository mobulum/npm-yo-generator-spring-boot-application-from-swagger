'use strict';
const mkdirp = require('mkdirp');
const Parser = require('swagger-parser');
const Path = require('path');

const utils = require('../../lib/utils');
const controllerImportsDecorator = require('../../lib/decorators/controller/controllerImportsDecorator').decorateController;
const controllerPackageDecorator = require('../../lib/decorators/controller/controllerPackageDecorator').decorateController;
const enumDefinitionRefDecorator = require('../../lib/decorators/ref/enumDefinitionRefDecorator').decorateRef;
const pathToRouteMapper = require('../../lib/mappers/pathToRouteMapper').map;
const routesToControllersMapper = require('../../lib/mappers/routesToControllersMapper').map;
const definitionPropertiesDecorator = require('../../lib/decorators/definition/definitionPropertiesDecorator').decorateDefinition;
const definitionTemplateNameDecorator = require('../../lib/decorators/definition/definitionTemplateNameDecorator').decorateDefinition;
const definitionPackageNameDecorator = require('../../lib/decorators/definition/definitionPackageNameDecorator').decorateDefinition;

const modules = ['api', 'service'];

const updateConfigPath = function updateConfigPath(props) {
  props.ymlApi = props.apiPath && (Path.extname(props.apiPath) === '.yml' || Path.extname(props.apiPath) === '.yaml');
};

const validateApi = function validateApi(props, done) {
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

const validate = function validate(propName) {
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

    const packageFolder = generator.props.basePackageName.replace(/\./g, '/');
    generator.props.packageFolder = packageFolder;
    generator.props.restPackage = 'rest';
    generator.props.controllersPackage = 'controllers';
    generator.props.modelPackage = 'model';
    generator.props.log = generator.log;

    modules.forEach(module => {
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
    modules.forEach(module => {
      mkdirp(generator.props[module + 'SrcDir']);
      mkdirp(generator.props[module + 'TestDir']);
      mkdirp(generator.props[module + 'IntegrationTestDir']);
      mkdirp(generator.props[module + 'ResDir']);
    });

    generator.fs.copy(generator.templatePath('.gitignore'), '.gitignore');
    generator.fs.copyTpl(
      generator.templatePath('settings.gradle'),
      generator.destinationPath('settings.gradle'),
      generator
    );
    generator.fs.copy(generator.templatePath('build.gradle'), 'build.gradle');

    mkdirp('gradle/wrapper');
    generator.fs.copy(generator.templatePath('gradlew'), 'gradlew');
    generator.fs.copy(generator.templatePath('gradlew.bat'), 'gradlew.bat');
    generator.fs.copy(generator.templatePath('gradle/wrapper/gradle-wrapper.jar'), 'gradle/wrapper/gradle-wrapper.jar');
    generator.fs.copy(generator.templatePath('gradle/wrapper/gradle-wrapper.properties'), 'gradle/wrapper/gradle-wrapper.properties');

    generator.fs.copyTpl(
      generator.templatePath('service/build.gradle'),
      generator.destinationPath('service/build.gradle'),
      generator
    );

    const servicePackageName = [generator.props.basePackageName, 'service'].join('.');

    generator.fs.copyTpl(
      generator.templatePath('service/Application.java'),
      generator.destinationPath(Path.join(generator.props.serviceSrcDir, 'Application.java')),
      {
        packageName: servicePackageName
      }
    );

    generator.fs.copyTpl(
      generator.templatePath('service/integrationTest/ApplicationIntegrationSpec.groovy'),
      generator.destinationPath(Path.join(generator.props.serviceIntegrationTestDir, 'ApplicationIntegrationSpec.groovy')),
      {
        packageName: servicePackageName
      }
    );

    generator.fs.copyTpl(
      generator.templatePath('service/integrationTest/AbstractRestControllerIntegrationSpec.groovy'),
      generator.destinationPath(Path.join(generator.props.serviceIntegrationTestDir, generator.props.restPackage, generator.props.controllersPackage, 'AbstractRestControllerIntegrationSpec.groovy')),
      {
        servicePackageName: servicePackageName,
        packageName: [servicePackageName, generator.props.restPackage, generator.props.controllersPackage].join('.')
      }
    );

    generator.fs.copyTpl(
      generator.templatePath('api/ErrorInfoResponse.java'),
      generator.destinationPath(Path.join(generator.props.apiSrcDir, generator.props.modelPackage, 'ErrorInfoResponse.java')),
      {
        servicePackageName: servicePackageName,
        packageName: [generator.props.basePackageName, 'api', generator.props.modelPackage].join('.')
      }
    );

    generator.fs.copyTpl(
      generator.templatePath('service/application.yml'),
      generator.destinationPath(generator.props.serviceResDir + '/application.yml'),
      generator
    );

    generator.fs.copy(generator.templatePath('api/build.gradle'), 'api/build.gradle');

    generator.config.set('basePackageName', generator.props.basePackageName);
    generator.config.set('packageFolder', generator.props.packageFolder);
    generator.config.set('restPackage', generator.props.restPackage);
    generator.config.set('controllersPackage', generator.props.controllersPackage);
  },

  routing: function routing(generator) {
    const routes = [];
    const paths = generator.props.api.paths;

    if (paths) {
      Object.keys(paths).forEach(path => {
        const route = pathToRouteMapper(path, paths[path], generator.props);
        routes.push(route);
      });
    }

    enumDefinitionRefDecorator(generator.props.refApi);

    Object.keys(generator.props.refApi.definitions).forEach(classname => {
      const definition = generator.props.refApi.definitions[classname];
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

    const controllers = routesToControllersMapper(routes, generator.props);

    Object.keys(controllers).forEach(classname => {
      const controller = controllers[classname];
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
