'use strict';

const Generator = require('yeoman-generator');
const app = require('../../lib/generators/app');

module.exports = class extends Generator {
  initializing() {
    this.props = {};
  }

  helloMsg() {
    this.log('Yeoman spring boot mvc application generator from swagger api specification');
  }

  prompting() {
    const self = this;
    const done = self.async();
    return this.prompt(app.prompts).then(function responses(props) {
      app.onResponses(self, props, done);
    });
  }

  writing() {
    app.write(this);
  }

  routing() {
    app.routing(this);
  }

  end() {
    // this.spawnCommand('./gradlew', ['build']);
  }

};
