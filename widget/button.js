const _ = require('lodash');
const Factory = require('../lib/factory');
const util = require('util');

var Button = function() {
  return this.init.apply(this, arguments);
};

util.inherits(Button, Factory);
Button.prototype.template = '../template/button.jade';

Button.prototype.init = function(attributes, text) {
  var attrDefaults = {
    type: 'submit',
  };

  /* Only text was passed in */
  if(arguments.length === 1 && typeof(attributes) === 'string') {
    text = attributes;
    attributes = {};
  }

  this.attributes = _.merge({}, attrDefaults, attributes);
  this.text = (text || value) || '';

  return this;
};

delete Button.prototype.validate;

module.exports = Button;
