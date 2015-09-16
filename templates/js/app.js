(function() {
  angular
    .module('app', [])
    .controller('FormController', FormController)
    .controller('TableController', TableController)
    .directive('formvalidate', formvalidate);

  var inputs = [
      {
        'name': 'Name:',
        'type': 'name',
        'placeholder': 'Input name',
        'error': 'Enter correct name',
        'model': ''
      },
      {
        'name': 'Email:',
        'type': 'email',
        'placeholder': 'Your email address',
        'error': 'Enter valid e-mail',
        'model': ''
      },
      {
        'name': 'Phone:',
        'type': 'phone',
        'placeholder': '+375ZZXXXYYYY',
        'error': 'Enter valid phone',
        'model': ''
      }
    ],
    model = {},
    headers = [
      {
        'value': '#'
      },
      {
        'value': 'Name'
      },
      {
        'value': 'Email'
      },
      {
        'value': 'Phone'
      },
      {
        'value': ''
      }
    ];

  function FormController($http) {
    var form = this;

    form.items = inputs;
    form.model = model;

    form.submitData = function() {
      var data = 'name=' + form.model['name'] +'&email=' + form.model['email'] + '&phone=' + form.model['phone'];
      console.log(form.items);
      console.log(data);

      $http.post('http://localhost:8888/items', data).success(function(data) {
        console.log('Posted', data);
      });
    }
  }

  function TableController($http) {
    var table = this;

    table.getData = function() {
      $http.get('http://localhost:8888/items').success(function(data) {
        table.rows = data;

        if (table.rows.length !== 0) {
          table.headers = headers;
        }
      });
    };

    table.deleteItem = function(id) {
      $http.delete('http://localhost:8888/items/?id=' + id).success(function() {
        table.getData();
        alert('Item deleted');
      });
    };
  }

  function formvalidate() {
    return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        ctrl.$parsers.unshift(function(arg) {
          var validExp, data;

          if (elm[0].name === 'name') {
            validExp = /^(\w+)$/;
          } else if (elm[0].name === 'email') {
            validExp = /^(\w+)(@\w+)(\.\w+)$/;
          } else if (elm[0].name === 'phone') {
            validExp = /^(\+375)([\d]{9})$|^(8017)([\d]{7})$/;
          }

          if (validExp.test(arg)) {
            ctrl.$setValidity('formvalidate', true);
            return arg;
          } else {
            ctrl.$setValidity('formvalidate', false);
            return undefined;
          }
        });
      }
    };
  }
})();
