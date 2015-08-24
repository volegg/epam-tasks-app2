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
    phoneError: 'Phone number should match on of the following patterns: +375ZZXXYYY or 8017XXXYYYY',
    emailError: 'Email should match the following pattern: foo@bar.baz',
    emptyError: 'This field must be filled',
    formEmptyError: 'The form must be filled',
    formItemsError: 'The form items are filled incorrectly',
    formItemsEmptyError: 'The form items are filled incorrectly or empty',
    submitButtonId: 'ajaxButton'
  };

  model = {
    /*Change error message in existing item*/
    changeErrorMessage: function(errorItem, errorMessage) {
      if (errorItem) {
        errorItem[0].innerText = errorMessage;
      }
    },

    /*Create new error item*/
    createErrorItem: function(parent, target, selector) {
      var errorItem = document.createElement(options.errorSpan);

      errorItem.className = selector;
      parent.insertBefore(errorItem, target);
      return parent.querySelectorAll('.' + selector);
    },

    /*Get NodeList of error items, False if none*/
    getErrorItems: function(selector, target) {
      var target = target || options.form,
          errorItem = target.parentNode.querySelectorAll('.' + selector);

      return (errorItem.length) ? errorItem : false;
    },

    /*Get NodeList of empty error items*/
    getEmptyItems: function(selector, option) {
      var itemArray = options.form.querySelectorAll(selector),
          emptyArray = [];

      for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].value === '') {
          emptyArray.push(i);
        } else if (option) {
          if (itemArray[i].innerText !== '') emptyArray.push(i);
        }
      }
      return emptyArray;
    },

    /*Return error mesage*/
    chooseErrorMessage: function(target, option) {
      var errorMessage = '';

      if (target.tagName === 'INPUT') {
        if (target.name === 'email') {
          if (!target.value.match(options.patternEmail)) {
            errorMessage = options.emailError;
          }
        } else if (target.name === 'phone') {
          if (!target.value.match(options.patternPhone)) {
            errorMessage = options.phoneError;
          }
        } else if (target.value === '') {
          errorMessage = options.emptyError;
        }
      } else {
        var emptyItems = model.getEmptyItems('input'),
            errorItems = model.getEmptyItems('.' + options.inputErrorClass, true);

        if (emptyItems.length !== 0 && errorItems.length === 0) {
          errorMessage = options.formEmptyError;
        } else if (emptyItems.length === 0 && errorItems.length !== 0) {
          errorMessage = options.formItemsError;
        } else if (emptyItems.length !== 0 && errorItems.length !== 0) {
          errorMessage = options.formItemsEmptyError;
        }
      }
      return errorMessage;
    },

    checkInputItems: function(target) {
      var errorItem,
          errorMessage = model.chooseErrorMessage(target, false),
          errorClass = options.inputErrorClass;

      errorItem = model.getErrorItems(errorClass, target);
      if (!errorItem) errorItem = model.createErrorItem(target.parentNode, target, errorClass);
      model.changeErrorMessage(errorItem, errorMessage);

      if (errorMessage !== '') {
        document.getElementById(options.submitButtonId).className = 'disabled';
      }

      model.checkForm(document.getElementById(options.submitButtonId));
    },

    checkForm: function(target, evt) {
      var errorMessage = model.chooseErrorMessage(target, true),
          errorClass = options.formErrorClass,
          errorItem;

      errorItem = model.getErrorItems(errorClass);
      if (!errorItem) errorItem = model.createErrorItem(target.parentNode, target, errorClass);
      model.changeErrorMessage(errorItem, errorMessage);
      if (errorMessage === '') target.className = 'enabled';

      if (typeof(evt) !== 'undefined') {
        evt.preventDefault();
        if (evt.type === 'click' && target.className === 'enabled') {
          ajax.httpClientRequest();
        }
      }
    }
  },

  ajax = {
    httpClientRequest: function() {
      var httpRequest;
      document.getElementById('ajaxButton').onclick = function() {
        makeRequest('http://localhost:8888/item');
      }

      function makeRequest(url) {
        alert(123);
        if (window.XMLHttpRequest) { // Mozilla, Safari, ...
          httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
          try {
            httpRequest = new ActiveXObject("Msxml2.XMLHTTP");
          }
          catch (e) {
            try {
              httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch (e) {}
          }
        }

        if (!httpRequest) {
          alert('Giving up :( Cannot create an XMLHTTP instance');
          return false;
        }
        httpRequest.onreadystatechange = alertContents;
        httpRequest.open('GET', url);
        httpRequest.send('POST', url);
      }

      function alertContents() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            console.log(httpRequest.responseText);
            alert(httpRequest.responseText);
          } else {
            alert('There was a problem with the request.');
          }
        }
      }
    }
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
        model.checkForm(target, evt);
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
