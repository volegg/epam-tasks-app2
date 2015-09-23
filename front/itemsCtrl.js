/**
 * Created by Yaroslav_Andryushche on 9/22/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .controller('itemsCtrl', implementItemsCtrl);

    function implementItemsCtrl($scope, $http) {
        var vm = this;
        vm.items = [];
        $http.get('/items').success(function (data) {
            vm.items = data;
        });

        vm.newItem = {};

        function emptyNewItem() {
            vm.newItem.name = '';
            vm.newItem.email = '';
            vm.newItem.phone = '';
        }


        emptyNewItem();

        vm.addNewItem = function (item) {
            var postData = "";
            var conjunction = "";

            for (field in item) {
                postData += conjunction + field + '=' + encodeURIComponent(item[field]);
                if (conjunction === '')
                    conjunction = "&";

            }

            $http.post('/items', postData).success(function (data) {
                vm.items.push(data);
                emptyNewItem();
                $scope.addItem.$setPristine();
            })
        }

        vm.deleteItem = function (id) {
            $http.delete('/items?id=' + id).success(function (data) {
                for (index in vm.items) {
                    if (vm.items.hasOwnProperty(index) && vm.items[index].id == id) {
                        delete vm.items[index];
                    }
                }
            });
        }

    }

})();