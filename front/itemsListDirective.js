/**
 * Created by Yaroslav_Andryushche on 9/28/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .directive('itemsList', createItemsListDirective);

    function createItemsListDirective() {
        return {
            restrict: 'E',
            templateUrl: 'front/items-list.html',
            controller: 'itemsListCtrl',
            controllerAs: 'itemsCtrl',
            scope: {},
        };
    }

})();