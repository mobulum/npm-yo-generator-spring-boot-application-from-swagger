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
      'api/src/main/java/com/mobulum/api/model/Order.java',
      'api/src/main/java/com/mobulum/api/model/Category.java',
      'api/src/main/java/com/mobulum/api/model/User.java',
      'api/src/main/java/com/mobulum/api/model/Tag.java',
      'api/src/main/java/com/mobulum/api/model/Pet.java',
      'api/src/main/java/com/mobulum/api/model/UploadResponse.java',
      'api/src/main/java/com/mobulum/api/model/OrderStatus.java',
      'api/src/main/java/com/mobulum/api/model/PetStatus.java',
      'service/src/main/java/com/mobulum/service/rest/controllers/V2PetController.java',
      'service/src/test/groovy/com/mobulum/service/rest/controllers/V2PetControllerSpec.groovy',
      'service/src/integrationTest/groovy/com/mobulum/service/rest/controllers/V2PetControllerIntegrationSpec.groovy',
      'service/src/main/java/com/mobulum/service/rest/controllers/V2StoreController.java',
      'service/src/test/groovy/com/mobulum/service/rest/controllers/V2StoreControllerSpec.groovy',
      'service/src/integrationTest/groovy/com/mobulum/service/rest/controllers/V2StoreControllerIntegrationSpec.groovy',
      'service/src/main/java/com/mobulum/service/rest/controllers/V2UserController.java',
      'service/src/test/groovy/com/mobulum/service/rest/controllers/V2UserControllerSpec.groovy',
      'service/src/integrationTest/groovy/com/mobulum/service/rest/controllers/V2UserControllerIntegrationSpec.groovy',
      '.gitignore',
      'settings.gradle',
      'build.gradle',
      'gradlew',
      'gradlew.bat',
      'gradle/wrapper/gradle-wrapper.jar',
      'gradle/wrapper/gradle-wrapper.properties',
      'service/build.gradle',
      'service/src/main/java/com/mobulum/service/Application.java',
      'service/src/integrationTest/groovy/com/mobulum/service/ApplicationIntegrationSpec.groovy',
      'service/src/integrationTest/groovy/com/mobulum/service/rest/controllers/AbstractRestControllerIntegrationSpec.groovy',
      'api/src/main/java/com/mobulum/api/model/ErrorInfoResponse.java',
      'service/src/main/resources/application.yml',
      'api/build.gradle'
    ]);
  });
});
