/*Validate form*/
var form = document.querySelector('form');

function formValidate(evt) {
  var targetEl = evt.target,
      parentEl = targetEl.parentNode,
      errClass = 'error-bottom',
      errEl = parentEl.querySelectorAll('.' + errClass),
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

  function inputChecker(target) {
    var patEmail = /^(\w+)(@\w+)(\.\w+)$/gi,
        patDouble = /^(\+375)([\d]{9})$|^(8017)([\d]{7})$/gi,
        errMsg = '';

    if (target.name === 'email') {
      if (!target.value.match(patEmail)) {
        errMsg = 'Email should match the following pattern: foo@bar.baz';
      }
    } else if (target.name === 'phone') {
      if (!target.value.match(patDouble)) {
        errMsg = 'Phone number should match on of the following patterns: +375XXXYYYY or 8017XXXYYYY';
      }
    }

    errMsgLoader(errEl,errMsg);
  }

  inputChecker(targetEl);
}

form.addEventListener('keyup', formValidate);
