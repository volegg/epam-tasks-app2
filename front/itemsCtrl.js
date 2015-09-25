/**
 * Created by Yaroslav_Andryushche on 9/22/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .controller('itemsCtrl', createItemsCtrl);

    function createItemsCtrl($scope, $http, itemsService) {
        var vm = this;
        vm.items = [];
        vm.newItem = {};
        vm.addNewItem = addNewItem;
        vm.deleteItem = deleteItem;

        emptyNewItem();

        //console.log(itemsService.getItems());
        itemsService.getItems().then(function (data) {
            vm.items = data;
        });


        function emptyNewItem() {
            vm.newItem.name = '';
            vm.newItem.email = '';
            vm.newItem.phone = '';
        }

        function addNewItem(item) {
            itemsService.addNewItem(item).then(onGetItemsSuccess);

            function onGetItemsSuccess(data) {
                vm.items.push(data);
                emptyNewItem();
                $scope.addItem.$setPristine();
            }
        }

        function deleteItem(id) {
            itemsService.deleteItem(id).then(onDelete);

            function onDelete(data) {
                for (index in vm.items) {
                    if (vm.items.hasOwnProperty(index) && vm.items[index].id == id) {
                        delete vm.items[index];
                    }
                }
            }
        }

    }

})();