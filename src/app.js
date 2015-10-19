(function () {
    var itemApp,
        ItemController,
        ItemFromResponseService;

    ItemController = function($http, ItemFromResponseService) {
        var self = this;

        this.items = [];

        this.create = function(item){
            $http.post('/items', item).success(function(data) {
                self.items.push(ItemFromResponseService.get(data));
            });
        };

        this.get = function() {
            $http.get('/items').success(function(data) {
                angular.forEach(data, function(obj){
                    self.items.push(ItemFromResponseService.get(obj));
                });
            });
        };
        this.get();
    };

    ItemFromResponseService = function () {
        this.get = function (responseObj) {
            var objId;
            var obj = {};
            angular.forEach(responseObj, function (v, k) {
                if (v == '') {
                    obj = JSON.parse(k);
                } else if (k == 'id') {
                    objId = v;
                }
            });
            obj.id = objId;
            return obj;
        };
    };

    itemApp = angular.module('itemApp', [])
        .controller('itemController', ['$http', 'ItemFromResponseService', ItemController])
        .service('ItemFromResponseService', ItemFromResponseService);
})();
