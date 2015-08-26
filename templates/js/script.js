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
    submitButtonId: 'ajaxButton',
    tableHeader: ['#','Name','Email','Phone','']
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
    chooseErrorMessage: function(target) {
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

    /*Check form inputs for errors*/
    checkInputItems: function(target) {
      var errorItem,
          errorMessage = model.chooseErrorMessage(target),
          errorClass = options.inputErrorClass;

      errorItem = model.getErrorItems(errorClass, target);
      if (!errorItem) errorItem = model.createErrorItem(target.parentNode, target, errorClass);
      model.changeErrorMessage(errorItem, errorMessage);

      if (errorMessage !== '') {
        document.getElementById(options.submitButtonId).className = 'disabled';
      }

      model.checkForm(document.getElementById(options.submitButtonId));
    },

    /*Check form for errors*/
    checkForm: function(target, evt) {
      var errorMessage = model.chooseErrorMessage(target),
          errorClass = options.formErrorClass,
          errorItem;

      errorItem = model.getErrorItems(errorClass);
      if (!errorItem) errorItem = model.createErrorItem(target.parentNode, target, errorClass);
      model.changeErrorMessage(errorItem, errorMessage);
      if (errorMessage === '') target.className = 'enabled';

      if (typeof(evt) !== 'undefined') {
        evt.preventDefault();
        if (evt.type === 'click' && target.className === 'enabled') {
          target.className = 'disabled';
          ajax.httpClientRequest(false);
        }
      }
    },

    /*Create table*/
    createTable: function(data) {
      var table = document.createElement('table'),
          tbody = document.createElement('tbody'),
          thead = document.createElement('thead'),
          caption = document.createElement('caption');

      table.id = 'ajaxTable';
      caption.innerText = 'Table';

      thead.appendChild(caption);
      thead.appendChild(model.createRow(true));
      table.appendChild(thead);
      tbody.appendChild(model.createRow(false, data));
      table.appendChild(tbody);

      options.form.parentNode.insertBefore(table, options.form.nextSibling);
    },

    /*Create row for table*/
    createRow: function(option, data) {
      var trow = document.createElement('tr'), el;

      (option) ? el = 'th' : el = 'td';

      function getRowData(i) {
        if (i === 0) {
          return (!document.querySelector('td')) ? 1 : document.querySelectorAll('tr').length ;
        } else if (i === 1) {
          return data.name;
        } else if (i === 2) {
          return data.email;
        } else if (i === 3) {
          return data.phone;
        } else if (i === 4) {
          var removeTag = '<a href="#' + data.id + '">Remove</a>';
          return removeTag;
        }
      }

      for (var i = 0; i < 5; i++) {
        var tcell = document.createElement(el);
        (option) ? tcell.innerHTML = options.tableHeader[i] : tcell.innerHTML = getRowData(i);
        trow.appendChild(tcell);
      }

      return trow;
    }
  },

  ajax = {
    /*Get form data*/
    getFormData: function(form, option) {
      var name = form.querySelector('input[name="name"]').value,
          email = form.querySelector('input[name="email"]').value,
          phone = form.querySelector('input[name="phone"]').value,
          data;

      return (!option) ? data = 'name=' + name +'&email=' + email + '&phone=' + phone : data = [name, email, phone];
    },

    /*Clear form after successful post event*/
    clearForm: function(form) {
      form.querySelector('input[name="name"]').value = '';
      form.querySelector('input[name="email"]').value = '';
      form.querySelector('input[name="phone"]').value = '';
    },

    /*Create xmlHttpRequest instance*/
    createHttpRequest: function() {
      var httpRequest;

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
      } else {
        return httpRequest;
      }
    },

    /*Make AJAX request to server
    * option = true triggers GET method
    * option = false triggers POST method*/
    compileRequest: function(url, option) {
      var httpRequest = ajax.createHttpRequest(),
          postData = ajax.getFormData(options.form, false),
          method;

      (option) ? method = 'GET' : method = 'POST';

      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            var tbody = document.querySelector('tbody'),
                response = httpRequest.responseText;

            function loadResponseData(response) {
              var tbody = document.querySelector('tbody');
              if (!tbody) {
                model.createTable(response);
              } else {
                tbody.appendChild(model.createRow(false, response))
              }
            }

            if (response.length > 3) {
              response = JSON.parse(response);

              if (option) {

              } else {
                ajax.clearForm(options.form);
              }

              if (!Array.isArray(response)) {
                loadResponseData(response);
              } else {
                for (var i = 0; i < response.length; i++) {
                  loadResponseData(response[i]);
                }
              }
            }
          } else {
            alert('There was a problem with the request.');
          }
        }
      };

      httpRequest.open(method, url);
      httpRequest.setRequestHeader('Content-type', 'application/json');
      (option) ? httpRequest.send() : httpRequest.send(postData);
    },

    /*Start AJAX request
    * option = true triggers GET method
    * option = false triggers POST method*/
    httpClientRequest: function(option) {
      var baseUrl = 'http://localhost:8888',
          postUrl = '/items',
          url;

      url = baseUrl + postUrl;

      ajax.compileRequest(url, option);
    }
  },

  handler = {
    formValidate: function(evt) {
      var target = evt.target;

      if (target.tagName === 'INPUT') {
        model.checkInputItems(target);
      }
    },

    formClick: function(evt) {
      var target = evt.target;

      if (target.id === options.submitButtonId) {
        model.checkForm(target, evt);
      } else if (target.tagName === 'INPUT') {
        model.checkInputItems(target);
      }
    },

    loadData: function(evt) {
      ajax.httpClientRequest(true)
    }
  };

  listener = {
    init: function() {
      document.addEventListener('keyup', handler.formValidate);
      document.addEventListener('click', handler.formClick);
      document.addEventListener('DOMContentLoaded', handler.loadData)
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
