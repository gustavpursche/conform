var assert = require("assert"),
    Button = require('../widget/button'),
    Input = require('../widget/input'),
    Form = require('../widget/form'),
    Label = require('../widget/label'),
    Group = require('../widget/group'),
    Promise = require('bluebird');

describe('Form', function() {
  describe('init', function() {
    it('should set the right attributes (with defaults)', function() {
      var form = new Form();

      assert.equal(form.fields.length, 0);
      assert.equal(form.attributes.action, '');
      assert.equal(form.attributes.method, 'post');
    });

    it('should set the right attributes (without defaults)', function() {
      var form = new Form([], {method: 'get', attr: 'test'});

      assert.equal(form.attributes.action, '');
      assert.equal(form.attributes.attr, 'test');
      assert.equal(form.attributes.method, 'get');
    });
  });

  describe('render', function() {
    it('should render correct without fields and buttons', function() {
      var form = new Form([], [], {}),
          rendered = form.render(),
          expect = '<form method="post" action=""></form>';

      assert.equal(rendered, expect);
    });

    it('should render correct without fields but buttons', function() {
      var button = new Button('Submit'),
          form = new Form([button], {}),
          rendered = form.render(),
          expect = '<form method="post" action="">' +
                    '<button type="submit">Submit</button>' +
                  '</form>';

      assert.equal(rendered, expect);
    });

    it('should render correct without fields but buttons in groups', function() {
      var button = new Button('Submit'),
          button2 = new Button('Cancel'),
          group = new Group('div', [button, button2]),
          form = new Form([group], {}),
          rendered = form.render(),
          expect = '<form method="post" action="">' +
                    '<div>' +
                      '<button type="submit">Submit</button>' +
                      '<button type="submit">Cancel</button>' +
                    '</div>' +
                  '</form>';

      assert.equal(rendered, expect);
    });

    it('should render correct with fields but without buttons', function() {
      var label = new Label('My Label'),
          input = new Input({id: 'test'}, label),
          form = new Form([input], [], {}),
          rendered = form.render(),
          expect = '<form method="post" action="">' +
                    '<label for="test">My Label</label>' +
                    '<input type="text" id="test"/>' +
                  '</form>';

      assert.equal(rendered, expect);
    });

    it('should allow grouping', function() {
      var input = new Input({}),
          group = new Group('div', [input]),
          form = new Form([group], [], {}),
          expected = '<form method="post" action="">' +
                      '<div>' +
                        '<input type="text"/>' +
                      '</div>' +
                     '</form>';

      assert.equal(form.render(), expected);
    });
  });

  describe('data', function() {
    it('should set the value for each field', function() {
      var input = new Input({name: 'test'}),
          input2 = new Input({name: 'test2'}),
          group = new Group('div', [input, input2]),
          form = new Form([group], [], {}),
          data = {
            test: 1,
            test2: null,
          };

      form.data(data);

      assert.equal(form.fields[0].fields[0].value(), 1);
      assert.equal(form.fields[0].fields[1].value(), null);
    });

    it('should allow chaining .data() and .render()', function() {
      var input = new Input({name: 'test'}),
          input2 = new Input({name: 'test2'}),
          group = new Group('div', [input, input2]),
          form = new Form([group], [], {}),
          data = {
            test: 1,
            test2: 'blubb',
          },
          rendered = form.data(data).render(),
          expected = '<form method="post" action="">' +
                      '<div>' +
                        '<input type="text" name="test" value="1"/>' +
                        '<input type="text" name="test2" value="blubb"/>' +
                      '</div>' +
                     '</form>';

      assert.equal(rendered, expected);
    });
  });

  describe('validate', function() {
    it('should validate all fields and return the errors', function(done) {
      var input = new Input({name: 'test', value: 2}),
          input2 = new Input({name: 'test2', value: 3}),
          form;

      input.validation({
        notTwo: function(value) {
          return new Promise(function(resolve, reject) {
            if(value === 2) {
              throw new Error('Should not equals 2');
            } else {
              resolve();
            }
          });
        },
      });

      input2.validation({
        notThree: function(value) {
          return new Promise(function(resolve, reject) {
            if(value === 3) {
              throw new Error('Should not equals 3');
            } else {
              resolve();
            }
          });
        }
      });

      form = new Form([input, input2], [], {});
      form
        .validate({test: 2, test2: 3})
        .then(function(errors) {
          assert.equal(errors.length, 2);
          assert.equal(errors[0].message, 'Should not equals 2');
          assert.equal(errors[1].message, 'Should not equals 3');
          done();
        });
    });

    it('should work with groups', function(done) {
      var input = new Input({name: 'name', value: 2}),
          button = new Button('Submit', {name: 'submit'})
          group = new Group('div', [input]),
          group2 = new Group('div', [button]),
          form = new Form([group, group2]),
          data = {
            name: 2,
            submit: 'text',
          };

      input.validation({
        notTwo: function(value) {
          return new Promise(function(resolve, reject) {
            if(value === 2) {
              throw new Error('Should not equals 2');
            } else {
              resolve();
            }
          });
        },
      });

      form
        .validate(data)
        .then(function(errors) {
          assert.equal(errors.length, 1);
          assert.equal(errors[0].message, 'Should not equals 2');
          done();
        });
    });
  });
});
