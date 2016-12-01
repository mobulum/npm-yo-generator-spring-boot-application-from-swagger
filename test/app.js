'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-spring-boot-application-from-swagger:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({someAnswer: true})
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      '.gitignore',
      'settings.gradle',
      'build.gradle',
      'gradlew',
      'gradlew.bat',
      'gradle/wrapper/gradle-wrapper.jar',
      'gradle/wrapper/gradle-wrapper.properties',
      'service/build.gradle',
      'service/src/main/java/com/mobulum/service/Application.java',
      'service/src/main/resources/application.yml'
    ]);
  });
});
