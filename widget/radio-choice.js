const _ = require('lodash');
const Factory = require('../lib/factory');
const Input = require('./input');
const Label = require('./label');
const util = require('util');

var Choice = function() {
  return this.init.apply(this, arguments);
};

util.inherits(Choice, Factory);
Choice.prototype.template = '../template/radio-choice.jade';

Choice.prototype.init = function(attributes, fields, label) {
  var self = this;

  this.attr(attributes);
  this._addFields(fields);

  /* Create choices */
  this.fields = _.map(this.fields, function(field, index) {
    var labelId,
    defaults = {
      type: 'radio',
      name: self.attr('name'),
    },
    label = new Label({}, field.text || ''),
    fieldOptions = _.omit(field, ['text']);

    if(!fieldOptions.id) {
      if(self.attr('id')) {
        labelId = self.attr('id') + '-' + index;
      } else {
        labelId = _.uniqueId('el_') + '-' + index;
      }

      fieldOptions.id = labelId;
    } else {
      labelId = fieldOptions.id;
    }

    label.attr({
      for: labelId,
    });

    return new Input(_.merge(defaults, fieldOptions), label);
  });

  this.value(this.attributes.value || undefined);

  this.validation({
    _fields: function(value) {
      return new Promise(function(resolve, reject) {
        var match = false;

        _.forEach(self.fields, function(field) {
          if(field.value() === value) {
            match = true;
            return false;
          }
        });

        if(match === false) {
          throw new Error('Please select at least one option');
        } else {
          resolve();
        }
      });
    },
  });

  return Factory.prototype.init.apply(this, [{}, label]);
};

Choice.prototype.value = function(value) {
  var self = this;

  if(value) {
    this._value = value

    if(this.fields && this.fields.length > 0) {
      _.forEach(this.fields, function(field) {
        if(field.value() === self._value) {
          field.attr('checked', 'checked');
        } else {
          delete field.attributes.checked;
        }
      });
    }
  }

  return this._value;
};

module.exports = Choice;
