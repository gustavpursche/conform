const _ = require('lodash');
const Factory = require('../lib/factory');

var Group = function() {
  return this.init.apply(this, arguments);
};

Group.prototype.template = '../template/group.jade';

Group.prototype.init = function(type, fields, attributes) {
  var self = this;

  this.fields = fields;
  this.type = type;
  this.required = true;

  return Factory.prototype.init.apply(this, [attributes]);
};

Group.prototype.tagStart = function() {
  var self = this;
  var renderAttributes = function() {
    var attrString = ' ';

    _.forEach(self.attributes, function(value, key) {
      attrString += key + '="' + value + '"';
    });

    if(attrString === ' ') {
      attrString = '';
    }

    return attrString;
  };

  return '<' + this.type + renderAttributes() + '>';
};

Group.prototype.tagEnd = function() {
  return '</' + this.type + '>';
};

Group.prototype.render = function() {
  return Factory.prototype.render.apply(this, [{prefix: 'element'}]);
};

Group.prototype.validator = function() {
  return Factory.prototype.validator.apply(this, arguments);
};

Group.prototype.validate = function() {
  return Factory.prototype.groupValidate.apply(this, arguments);
};

module.exports = Group;
