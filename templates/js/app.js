(function() {
  var app = angular.module('app', []),
      inputs = [
        {
          'name': 'Name:',
          'type': 'name',
          'value': 'Input name'
        },
        {
          'name': 'Email:',
          'type': 'email',
          'value': 'Your email address'
        },
        {
          'name': 'Phone:',
          'type': 'phone',
          'value': '+375ZZXXXYYYY'
        }
      ],
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

  app.controller('FormController', function () {
    this.items = inputs;
  });

  app.controller('TableController', ['$http', function ($http) {
    var table = this;

    $http.get('http://localhost:8888/items').success(function(data) {
      table.rows = data;
      if (data.length !== 0) {

        table.headers = headers;
        table.rows = data;
      }
    });

    table.deleteItem = function(id) {
      $http.delete('http://localhost:8888/items/?id=' + id).success(function(response) {
        alert('Item deleted.');
      });
    };
  }]);
})();
