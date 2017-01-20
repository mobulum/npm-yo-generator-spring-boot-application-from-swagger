'use strict';
var yeoman = require('yeoman-generator');
var app = require('../../lib/generators/app');

module.exports = yeoman.Base.extend({
  helloMsg: function helloMsg() {
    this.log('Yeoman spring boot mvc application generator from swagger api specification');
  },

  prompting: function prompting() {
    var done = this.async();
    return this.prompt(app.prompts).then(function responses(props) {
      app.onResponses(this, props, done);
    }.bind(this));
  },

  writing: function writing() {
    app.write(this);
  },

  routing: function routing() {
    app.routing(this);
  },

  end: function end() {
    // this.spawnCommand('./gradlew', ['build']);
  }

});
