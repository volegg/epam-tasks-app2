(function () {
    var itemApp,
        ItemController;

    ItemController = function($http) {
        this.create = function(user){
            $http.post('/items', user).success(function(data) {
                console.log('Posted', data);
            });
        };
    };

    itemApp = angular.module('itemApp', [])
        .controller('itemController', ['$http', ItemController]);

})();
