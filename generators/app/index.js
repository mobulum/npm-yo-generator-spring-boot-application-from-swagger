'use strict';

const Generator = require('yeoman-generator');
const app = require('../../lib/generators/app');
const optionOrPrompt = require('../../lib/utils').yeomanOptionOrPrompt;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--use-cli-defaults` flag
    this.option('useDefaults', {
      name: 'use-cli-defaults',
      description: 'Use default values if not provided (will not prompt)',
      hide: false
    });

    // This method adds support for a `--run-gradle-build` flag
    this.option('runGradleBuild', {
      name: 'run-gradle-build',
      description: 'Run build gradle on generated project',
      hide: false
    });

    app.prompts.forEach(prompt =>
      this.option(prompt.name, {
        name: prompt.cliName,
        description: prompt.message,
        type: String,
        default: (this.options.useCliDefaults || this.options.help) ? prompt.default : undefined,
        hide: false
      })
    );

    this._optionOrPrompt = optionOrPrompt;
  }

  initializing() {
    this.props = {};
  }

  helloMsg() {
    this.log('Yeoman spring boot mvc application generator from swagger api specification');
  }

  prompting() {
    const self = this;
    const done = self.async();
    return this._optionOrPrompt(app.prompts).then(function responses(props) {
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
    if (this.options.runGradleBuild) {
      this.spawnCommand('./gradlew', ['build']);
    } else {
      this.log('Skipping run gradle build (no --run-gradle-build flag set)');
    }
  }

};
