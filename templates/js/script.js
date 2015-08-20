/*Validate form*/
var ClientScript = function () {
  var options,
      model,
      ajax,
      handler,
      listener;

  options = {
    form: document.querySelector('form'),
    inputErrorClass: 'error-bottom',
    formErrorClass: 'error-form',
    errorSpan: 'span',
    patternEmail: /^(\w+)(@\w+)(\.\w+)$/gi,
    patternPhone: /^(\+375)([\d]{9})$|^(8017)([\d]{7})$/gi,
    phoneError: 'Phone number should match on of the following patterns: +375XXXYYYY or 8017XXXYYYY',
    emailError: 'Email should match the following pattern: foo@bar.baz',
    emptyError: 'This field must be filled',
    formError: 'The form must be filled',
    submitButtonId: 'ajaxButton'
  };

  model = {
    errorMessageChange: function(errorItem, errorMessage) {
      if (errorItem) {
        errorItem[0].innerText = errorMessage;
      }
    },

    errorItemCreate: function(parent, target) {
      var errorItem = document.createElement(options.errorSpan);

      errorItem.className = options.inputErrorClass;
      parent.insertBefore(errorItem, target);
      return parent.querySelectorAll('.' + options.inputErrorClass);
    },

    checkErrorItems: function(target, errorClass) {
      var errorItem = target.parentNode.querySelectorAll('.' + errorClass);

      return (errorItem.length) ? errorItem : false;
    },

    checkInputItems: function(target) {
      var errorMessage = '', errorItem;

      if (target.name === 'email') {
        if (!target.value.match(options.patternEmail)) {
          errorMessage = options.emailError;
        }
      } else if (target.name === 'phone') {
        if (!target.value.match(options.patternPhone)) {
          errorMessage = options.phoneError;
        }
      }

      if (target.value === '') errorMessage = options.emptyError;

      errorItem = model.checkErrorItems(target, options.inputErrorClass);
      if (!errorItem) errorItem = model.errorItemCreate(target.parentNode, target);
      model.errorMessageChange(errorItem, errorMessage);
    },

    checkForm: function(target) {

    }
  };

  ajax = {

  },

  handler = {
    formValidate: function(evt) {
      var target = evt.target;

      if (target.tagName === 'INPUT') {
        model.checkInputItems(target);
      }
    },

    formSubmit: function(evt) {
      var target = evt.target;

      if (target.id === options.submitButtonId) {
        console.log(target);
        evt.preventDefault();
      } else if (target.tagName === 'INPUT') {
        model.checkInputItems(target);
      }
    }
  };

  listener = {
    init: function() {
      document.addEventListener('keyup', handler.formValidate);
      document.addEventListener('click', handler.formSubmit);
    }
  };

  // Return object
  return {
    model: model,
    ajax: ajax,
    handler: handler,
    listener: listener
  };

}();

ClientScript.listener.init();
