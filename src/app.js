(function () {
    var itemApp,
        ItemController;

    ItemController = function($http) {
        var self = this;

        this.items = [];

        this.create = function(item){
            $http.post('/items', item).success(function(data) {
                self.items.push(data);
            });
        };

        this.get = function() {
            $http.get('/items').success(function(data) {
                self.items = data;
            });
        };

        this.remove = function(item) {
            $http.delete('/items?id=' + item.id).success(function(data) {
                console.log('Delete', data);
                self.get();
            });
        };

        this.get();
    };

    itemApp = angular.module('itemApp', [])
        .controller('itemController', ['$http', ItemController]);
})();
