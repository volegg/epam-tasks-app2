var httpRequest;

document.getElementById("ajaxButton").onclick = function() {
  makeRequest('http://localhost:8888/items');
};

function makeRequest(url) {
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
  httpRequest.open('GET', url + '/form', true);
  httpRequest.send('POST', url + '/items', true);
}

function alertContents() {
  if (httpRequest.readyState === 4) {
    if (httpRequest.status === 200) {
      alert(httpRequest.responseText);
    } else {
      alert('There was a problem with the request.');
    }
  }
}

/*Validate form*/
var form = document.querySelector('form'),
    submitBtn = form.querySelectorAll('ajaxButton');

function formValidate(evt) {
  var targetEl = evt.target,
      inputText = targetEl.value,
      parentEl = targetEl.parentNode,
      errClass = 'error-message',
      errEl = parentEl.querySelectorAll('.' + errClass),
      errMsg,
      errorCont = document.createElement('span');

  errorCont.className = errClass;

  function errMsgLoader(errEl, errMsg) {
    if (errEl.length) {
      errEl[0].innerText = errMsg;
    } else {
      errorCont.innerText = errMsg;
      parentEl.insertBefore(errorCont,targetEl);
    }
  }

  if (targetEl.name !== 'name') {
    if (targetEl.name === 'email') {
      var patEmail = /^(\w+)(@\w+)(\.\w+)$/gi;

      if (!inputText.match(patEmail)) {
        errMsg = 'Email should match the following pattern: foo@bar.baz';
      } else if (inputText.match(patEmail)) {
        errMsg = '';
      }
    } else if (targetEl.name === 'phone') {
      var patLong = /^(\+375)([\d]{9})$/gi,
          patShort = /^(8017)([\d]{7})$/gi;

      if (!inputText.match(patLong) && !inputText.match(patShort)) {
        errMsg = 'Phone number should match on of the following patterns: +375XXXYYYY or 8017XXXYYYY';
      } else if (inputText.match(patLong) || inputText.match(patShort)) {
        errMsg = '';
      }
    }
    errMsgLoader(errEl,errMsg);
  }
}

function submitForm(evt) {
  var targetEl = evt.target;

  if (targetEl.id === 'ajaxButton') {
    if (targetEl.className === 'enabled') {

    } else if (targetEl.className === 'disabled') {
      evt.preventDefault();
    }
  }
}

form.addEventListener('keyup', formValidate);
form.addEventListener('click', submitForm);
