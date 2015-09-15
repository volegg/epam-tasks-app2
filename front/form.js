/**
 * Created by Yaroslav_Andryushche on 8/26/2015.
 */


var staffApp = angular.module('staffManagementApp', []);

staffApp.controller('itemsCtrl', function ($scope, $http) {
    $scope.items = [];
    $http.get('/items').success(function(data){
        $scope.items = data;
    });

    $scope.newItem = {};

    function emptyNewItem() {
        $scope.newItem.name = '';
        $scope.newItem.email = '';
        $scope.newItem.phone = '';
    }




    emptyNewItem();

    $scope.addNewItem = function(item){
        var postData = "";
        var conjunction = "";

        for(field in item) {
            postData += conjunction + field + '=' + encodeURIComponent(item[field]);
            if (conjunction === '')
                conjunction = "&";

        }

        $http.post('/items', postData).success(function(data){
            $scope.items.push(data);
            emptyNewItem();
            $scope.addItem.$setPristine();
        })
    }

    $scope.deleteItem = function(id) {
        $http.delete('/items?id='+id).success(function(data){
            for (index in $scope.items) {
                if ($scope.items.hasOwnProperty(index) && $scope.items[index].id == id){
                    delete $scope.items[index];
                }
            }
        });
    }

});

