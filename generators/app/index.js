'use strict';
var yeoman = require('yeoman-generator');
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
  props.ymlApi = false;
  if (props.apiPath && ('.yml' === Path.extname(props.apiPath) || '.yaml' === Path.extname(props.apiPath))) {
    props.ymlApi = true;
  }
};

var validateApi = function validateApi(props, done) {
  Parser.validate(props.apiPath, function (error, api) {
    if (error) {
      done(error);
      return;
    }

    props.api = api;
    Parser.parse(props.apiPath, function (errorRef, refApi) {

      if (errorRef) {
        done(errorRef);
        return;
      }

      props.refApi = refApi;
      done();
    });
  });
};

var validate = function (propName) {
  return !!propName;
};

module.exports = yeoman.Base.extend({
  helloMsg: function () {
    this.log('Yeoman spring boot mvc application generator from swagger api specification');
  },

  prompting: function () {
    var done = this.async();
    var prompts = [
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
        // default: 'http://petstore.swagger.io/v2/swagger.json',
        default: '/Users/zenedith/git/yeoman/generator-spring-boot-application-from-swagger/example/pet-store-swagger.json',
        // default: '/Users/zenedith/git/yeoman/generator-spring-boot-application-from-swagger/example/vh-swagger.json',
        // default: '/Users/zenedith/git/yeoman/generator-spring-boot-application-from-swagger/example/receipts-swagger.json',
        validate: validate
      }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      var self = this;
      this.props = props;

      var packageFolder = this.props.basePackageName.replace(/\./g, '/');
      this.props.packageFolder = packageFolder;
      this.props.restPackage = 'rest';
      this.props.controllersPackage = 'controllers';
      this.props.modelPackage = 'model';

      modules.forEach(function (module) {
        self.props[module + 'SrcDir'] = Path.join(module, 'src/main/java', packageFolder, module);
        self.props[module + 'ResDir'] = Path.join(module, 'src/main/resources');
        self.props[module + 'TestDir'] = Path.join(module, 'src/test/groovy', packageFolder, module);
        self.props[module + 'IntegrationTestDir'] = Path.join(module, 'src/integrationTest/groovy', packageFolder, module);
      });

      //parse and validate the Swagger API entered by the user.
      if (props.apiPath) {
        updateConfigPath(this.props);
        validateApi(this.props, done);
      } else {
        done();
      }

    }.bind(this));
  },

  writing: function () {
    var self = this;
    // console.log(this.props);

    modules.forEach(function (module) {
      mkdirp(self.props[module + 'SrcDir']);
      mkdirp(self.props[module + 'TestDir']);
      mkdirp(self.props[module + 'IntegrationTestDir']);
      mkdirp(self.props[module + 'ResDir']);
    });

    this.copy('.gitignore', '.gitignore');
    this.copy('settings.gradle', 'settings.gradle');
    this.copy('build.gradle', 'build.gradle');

    mkdirp('gradle/wrapper');
    this.copy('gradlew', 'gradlew');
    this.copy('gradlew.bat', 'gradlew.bat');
    this.copy('gradle/wrapper/gradle-wrapper.jar', 'gradle/wrapper/gradle-wrapper.jar');
    this.copy('gradle/wrapper/gradle-wrapper.properties', 'gradle/wrapper/gradle-wrapper.properties');

    this.template('service/build.gradle', 'service/build.gradle');

    var servicePackageName = [this.props.basePackageName, 'service'].join('.');

    this.template(
      'service/Application.java',
      Path.join(this.props.serviceSrcDir, 'Application' + '.java'),
      {
        packageName: servicePackageName
      }
    );
    this.template(
      'service/integrationTest/ApplicationIntegrationSpec.groovy',
      Path.join(this.props.serviceIntegrationTestDir, 'ApplicationIntegrationSpec' + '.groovy'),
      {
        packageName: servicePackageName
      }
    );

    this.template(
      'service/integrationTest/AbstractRestControllerIntegrationSpec.groovy',
      Path.join(this.props.serviceIntegrationTestDir, self.props.restPackage, self.props.controllersPackage, 'AbstractRestControllerIntegrationSpec' + '.groovy'),
      {
        servicePackageName: servicePackageName,
        packageName: [servicePackageName, self.props.restPackage, self.props.controllersPackage].join('.')
      }
    );

    this.template(
      'api/ErrorInfoResponse.java',
      Path.join(this.props.apiSrcDir, this.props.modelPackage, 'ErrorInfoResponse.java'),
      {
        servicePackageName: servicePackageName,
        packageName: [this.props.basePackageName, 'api', this.props.modelPackage].join('.')
      }
    );

    this.template('service/application.yml', this.props.serviceResDir + '/application.yml');

    this.copy('api/build.gradle', 'api/build.gradle');

    this.config.set('basePackageName', this.props.basePackageName);
    this.config.set('packageFolder', this.props.packageFolder);
    this.config.set('restPackage', this.props.restPackage);
    this.config.set('controllersPackage', this.props.controllersPackage);
  },

  routing: function () {
    var self = this;
    var routes = [];
    var paths = this.props.api.paths;

    // console.dir(this.props.refApi, {depth: 10});

    if (paths) {
      Object.keys(paths).forEach(function (path) {
        var route = pathToRouteMapper(path, paths[path], self.props);
        routes.push(route);
      });
    }

    enumDefinitionRefDecorator(this.props.refApi);

    Object.keys(this.props.refApi.definitions).forEach(function (classname) {
      var definition = self.props.refApi.definitions[classname];
      definitionPropertiesDecorator(classname, definition, self.props);
      definitionTemplateNameDecorator(classname, definition, self.props);
      definitionPackageNameDecorator(classname, definition, self.props);

      definition.capitalize = utils.capitalize;

      self.fs.copyTpl(
        self.templatePath(definition.template),
        self.destinationPath(definition.destination),
        definition
      );
    });

    var controllers = routesToControllersMapper(routes, this.props);

    Object.keys(controllers).forEach(function (classname) {
      var controller = controllers[classname];
      controllerImportsDecorator(controller, self.props);
      controllerPackageDecorator(controller, self.props);

      self.fs.copyTpl(
        self.templatePath('service/RestController.java'),
        self.destinationPath(controller.restControllerDestination),
        controller
      );

      self.fs.copyTpl(
        self.templatePath('service/test/RestControllerSpec.groovy'),
        self.destinationPath(controller.restControllerSpecDestination),
        controller
      );

      self.fs.copyTpl(
        self.templatePath('service/integrationTest/RestControllerIntegrationSpec.groovy'),
        self.destinationPath(controller.restControllerIntegrationSpecDestination),
        controller
      );
    })
  },

  end: function () {
    // this.spawnCommand('./gradlew', ['build']);
  }

});
