/* Validate form client-run script with AJAX and DOM-mutation functionality. */
var ClientScript = function () {
  var options,
      model,
      ajax,
      handler,
      listener;

  /* Options namespace: contains globally accessible variables */
  options = {
    form: document.querySelector('form'),
    inputErrorClass: 'error-bottom',
    formErrorClass: 'error-form',
    errorSpan: 'span',
    patternEmail: /^(\w+)(@\w+)(\.\w+)$/gi,
    patternPhone: /^(\+375)([\d]{9})$|^(8017)([\d]{7})$/gi,
    patternPhonePlus: /^(375)([\d]{9})$/gi,
    phoneError: 'Phone number should match on of the following patterns: +375ZZXXYYY or 8017XXXYYYY',
    emailError: 'Email should match the following pattern: foo@bar.baz',
    emptyError: 'This field must be filled',
    formEmptyError: 'The form must be filled',
    formItemsError: 'The form items are filled incorrectly',
    formItemsEmptyError: 'The form items are filled incorrectly or empty',
    submitButtonId: 'ajaxButton',
    tableHeader: ['#','Name','Email','Phone','']
  };

  /* Model namespace: contains major logic and functionality of the client-side app. */
  model = {
    /* Change error message in existing error items. */
    changeErrorMessage: function(errorItem, errorMessage) {
      if (errorItem) {
        errorItem[0].innerText = errorMessage;
      }
    },

    /* Create new error items. */
    createErrorItem: function(parent, target, selector) {
      var errorItem = document.createElement(options.errorSpan);

      errorItem.className = selector;
      parent.insertBefore(errorItem, target);
      return parent.querySelectorAll('.' + selector);
    },

    /* Return NodeList of error items.
     Returns 'false' if none. */
    getErrorItems: function(selector, target) {
      var target = target || options.form,
          errorItem = target.parentNode.querySelectorAll('.' + selector);

      return (errorItem.length) ? errorItem : false;
    },

    /* Return NodeList of empty error items. */
    getEmptyItems: function(selector, option) {
      var itemArray = options.form.querySelectorAll(selector),
          emptyArray = [];

      /* Iterate through NodeList of error items.
       * Return empty ones. */
      for (var i = 0; i < itemArray.length; i++) {
        if (itemArray[i].value === '') {
          emptyArray.push(i);
        } else if (option) {
          if (itemArray[i].innerText !== '') emptyArray.push(i);
        }
      }
      return emptyArray;
    },

    /* Return error mesage depending on:
    *   - error type;
    *   - error item. */
    chooseErrorMessage: function(target) {
      var errorMessage = '';

      /* Returns input-level errors. */
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
      /* Returns form-level errors. */
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

    /* Check input elements for validation errors. */
    checkInputItems: function(target) {
      var errorItem,
          errorMessage = model.chooseErrorMessage(target),
          errorClass = options.inputErrorClass;

      errorItem = model.getErrorItems(errorClass, target);
      if (!errorItem) errorItem = model.createErrorItem(target.parentNode, target, errorClass);
      model.changeErrorMessage(errorItem, errorMessage);

      /* Disable 'Submit' button if errors exist. */
      if (errorMessage !== '') {
        document.getElementById(options.submitButtonId).className = 'disabled';
      }

      /* Validate form for errors. */
      model.checkForm(document.getElementById(options.submitButtonId));
    },

    /* Check form for validation errors. */
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

        /* Initialize specific AJAX request if from is valid and use clicked on 'Submit' button. */
        if (evt.type === 'click' && target.className === 'enabled') {
          target.className = 'disabled';
          ajax.httpClientRequest('POST');
        }
      }
    },

    /* Create data table in DOM. */
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

    /* Create row in data table. */
    createRow: function(option, data) {
      var trow = document.createElement('tr'), el;

      el = (option) ? 'th' : 'td';

      /* Function to get data for row from server response JSON object. */
      function getRowData(i) {
        if (i === 0) {
          return (!document.querySelector('td')) ? 1 : document.querySelectorAll('tr').length ;
        } else if (i === 1) {
          return data.name;
        } else if (i === 2) {
          return data.email;
        } else if (i === 3) {
          return (JSON.stringify(data.phone).match(options.patternPhonePlus))? '+' + data.phone : data.phone;
        } else if (i === 4) {
          var removeTag = '<a href="#' + data.id + '" class="remove" id="' + data.id + '">Remove</a>';
          return removeTag;
        }
      }

      /* Iterate through row cells and set inner cell data. */
      for (var i = 0; i < 5; i++) {
        var tcell = document.createElement(el);
        tcell.innerHTML = (option) ? options.tableHeader[i] : getRowData(i);
        trow.appendChild(tcell);
      }

      return trow;
    },

    /* Delete row from data table.
    * If the last row was deleted then delete the whole table. */
    deleteRow: function(id) {
      var anchor = document.getElementById(id),
          cell = anchor.parentNode,
          row = cell.parentNode,
          body = row.parentNode,
          table = body.parentNode;

      body.removeChild(row);

      if (body.querySelectorAll('tr').length === 0) {
        table.parentNode.removeChild(table);
      } else {
        /* Call table re-index function. */
        model.reindexTable(body);
      }
    },

    /* Re-index order number column in data table. */
    reindexTable: function(body) {
      var rowArray = body.childNodes;

      /* Iterate through table rows and re-index cell values. */
      for (var i = 0; i < rowArray.length; i++) {
        if (rowArray[i].firstChild.innerText !== i + 1) rowArray[i].firstChild.innerText = i + 1;
      }
    }
  };

  /* AJAX namespace: handles xmlHttpRequest logic and fucntionality. */
  ajax = {
    /* Return form data. */
    getFormData: function(form, option) {
      var name = form.querySelector('input[name="name"]').value,
          email = form.querySelector('input[name="email"]').value,
          phone = form.querySelector('input[name="phone"]').value,
          data;

      return data = (!option) ? 'name=' + name +'&email=' + email + '&phone=' + phone : [name, email, phone];
    },

    /* Clear form from data after successful post event. */
    clearForm: function(form) {
      form.querySelector('input[name="name"]').value = '';
      form.querySelector('input[name="email"]').value = '';
      form.querySelector('input[name="phone"]').value = '';
    },

    /* Create xmlHttpRequest instance. */
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

    /* Make AJAX request to server.
    * 'id' - optional, required for 'DELETE' method only. */
    compileRequest: function(url, method, id) {
      var httpRequest = ajax.createHttpRequest(),
          postData = ajax.getFormData(options.form, false);

      /* Handle server response. */
      httpRequest.onreadystatechange = function() {
        if (httpRequest.readyState === 4) {
          if (httpRequest.status === 200) {
            var tbody = document.querySelector('tbody'),
                response = httpRequest.responseText;

            /* (Asynchronous) Function to write server response data to DOM if successful. */
            function writeResponseData(response) {
              var tbody = document.querySelector('tbody');
              if (!tbody) {
                model.createTable(response);
              } else {
                tbody.appendChild(model.createRow(false, response))
              }
            }

            if (response.length > 3) {
              response = JSON.parse(response);

              if (method === 'POST') {
                ajax.clearForm(options.form);
              }

              if (method !== 'DELETE') {
                if (!Array.isArray(response)) {
                  writeResponseData(response);
                } else {
                  for (var i = 0; i < response.length; i++) {
                    writeResponseData(response[i]);
                  }
                }
              } else if (method === 'DELETE') {
                model.deleteRow(id);
                alert('Item deleted');
              }
            }
          } else {
            alert('There was a problem with the request.');
          }
        }
      };

      httpRequest.open(method, url);
      httpRequest.setRequestHeader('Content-type', 'application/json');
      (method === 'GET') ? httpRequest.send() : httpRequest.send(postData);
    },

    /* Start AJAX request:
     * id - optional, required for 'DELETE' method only. */
    httpClientRequest: function(method, id) {
      var baseUrl = 'http://localhost:8888',
          postUrl = '/items',
          url;

      url = baseUrl + postUrl;

      if (method === 'DELETE') {
        url = url + '?id=' + id;
      }

      ajax.compileRequest(url, method, id);
    }
  };

  /* Handler namespace: handles script operation to respective functions/methods. */
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
      } else if (target.tagName === 'A' && target.className === 'remove') {
        ajax.httpClientRequest('DELETE', target.id);
      }
    },

    loadData: function() {
      ajax.httpClientRequest('GET')
    }
  };

  /* (Asynchronous) Listener namespace: initiates event listeners. */
  listener = {
    init: function() {
      document.addEventListener('keyup', handler.formValidate);
      document.addEventListener('click', handler.formClick);
      document.addEventListener('DOMContentLoaded', handler.loadData);
    }
  };

  /* Return object */
  return {
    model: model,
    ajax: ajax,
    handler: handler,
    listener: listener
  };

}();

/* Initialiaze object */
ClientScript.listener.init();
