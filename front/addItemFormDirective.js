/**
 * Created by Yaroslav_Andryushche on 9/28/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .directive('addItemForm', createAddItemFormDirective);

    function createAddItemFormDirective() {
        return {
            restrict: 'E',
            templateUrl: 'front/add-item-form.html',
            controller: 'addItemFormCtrl',
            controllerAs: 'itemsCtrl',
            bindToController: true,
        };
    }

})();