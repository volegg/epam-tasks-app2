/**
 * Created by Yaroslav_Andryushche on 9/22/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .controller('addItemFormCtrl', createAddItemForm);

    function createAddItemForm($scope, itemsService) {
        var vm = this;
        vm.newItem = {};
        vm.addNewItem = addNewItem;

        emptyNewItem();

        function emptyNewItem() {
            vm.newItem.name = '';
            vm.newItem.email = '';
            vm.newItem.phone = '';
        }

        function addNewItem(item) {
            itemsService.addNewItem(item).then(onGetItemsSuccess);

            function onGetItemsSuccess(data) {
                $scope.$emit('AddNewItem', data);
                emptyNewItem();
                $scope.addItem.$setPristine();
            }
        }
    }

})();