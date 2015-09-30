/**
 * Created by Yaroslav_Andryushche on 9/22/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .controller('itemsListCtrl', createItemsList);

    function createItemsList($scope, $rootScope,itemsService) {
        var vm = this;
        vm.items = [];
        vm.deleteItem = deleteItem;

        activate();

        function activate() {
            itemsService.getItems().then(function (data) {
                vm.items = data;
            });

            $rootScope.$on('AddNewItem', addNewItem);
        }

        function addNewItem(event, item) {
            vm.items.push(item);
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