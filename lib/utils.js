'use strict';

const Promise = require('pinkie-promise');

const capitalize = function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const methodName = function methodName(method) {
  return method.toLowerCase();
};

// https://www.npmjs.com/package/yeoman-option-or-prompt
const yeomanOptionOrPrompt = function yeomanOptionOrPrompt(prompts) {
  // This method will only show prompts that haven't been supplied as options. This makes the generator more composable.
  const filteredPrompts = [];
  const props = new Map();

  prompts.forEach(function prompts(prompt) {
    this.option(prompt.name);
    const option = this.options[prompt.name];

    if (option === undefined) {
      // No option supplied, user will be prompted
      filteredPrompts.push(prompt);
    } else {
      // Options supplied, add to props
      props[prompt.name] = option;
    }
  }, this);

  if (filteredPrompts.length) {
    return this.prompt(filteredPrompts).then(function responses(mergeProps) {
      // Merge mergeProps into props/
      Object.assign(props, mergeProps);
      return props;
    });
  }

  // No prompting required call the callback right away.
  return Promise.resolve(props);
};

module.exports = {
  capitalize: capitalize,
  methodName: methodName,
  yeomanOptionOrPrompt: yeomanOptionOrPrompt
};
