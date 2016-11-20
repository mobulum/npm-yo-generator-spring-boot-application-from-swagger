'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = yeoman.Base.extend({
  helloMsg: function () {
    this.log('Yeoman spring boot mvc application generator from swagger api specification');
  },

  prompting: function () {
    var prompts = [
      {
        type: 'string',
        name: 'packageName',
        message: 'Enter default package name:',
        default: 'com.mobulum'
      },
      {
        type: 'string',
        name: 'baseName',
        message: 'Enter base name of app:',
        default: 'app'
      }];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      this.props = props;
    }.bind(this));
  },

  writing: function () {
    var packageFolder = this.props.packageName.replace(/\./g, '/');

    ['api', 'service'].forEach(function (module) {
      var srcDir = module + '/src/main/java/' + packageFolder;
      mkdirp(srcDir);

      var resourceDir = module + '/src/main/resources';
      mkdirp(resourceDir);

      var testDir = module + '/src/test/groovy/' + packageFolder;
      mkdirp(testDir);
    });

    var serviceSrcDir = 'service/src/main/java/' + packageFolder;
    var serviceResourceDir = 'service/src/main/resources';

    this.copy('.gitignore', '.gitignore');
    this.copy('settings.gradle', 'settings.gradle');
    this.copy('build.gradle', 'build.gradle');

    mkdirp('gradle/wrapper');
    this.copy('gradlew', 'gradlew');
    this.copy('gradlew.bat', 'gradlew.bat');
    this.copy('gradle/wrapper/gradle-wrapper.jar', 'gradle/wrapper/gradle-wrapper.jar');
    this.copy('gradle/wrapper/gradle-wrapper.properties', 'gradle/wrapper/gradle-wrapper.properties');

    this.template('service/build.gradle', 'service/build.gradle');
    this.template('service/Application.java', serviceSrcDir + '/Application.java');
    this.template('service/application.yml', serviceResourceDir + '/application.yml');

    this.copy('api/build.gradle', 'api/build.gradle');

    this.config.set('packageName', this.props.packageName);
    this.config.set('packageFolder', packageFolder);
  }
});
