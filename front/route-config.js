/**
 * Created by Yaroslav_Andryushche on 9/30/2015.
 */
(function() {
    angular
        .module('staffManagementApp')
        .config(config);

    function config($routeProvider) {
        $routeProvider
            .when('/form', {
                templateUrl: 'front/items-list.html',
                controller: 'itemsListCtrl',
                controllerAs: 'itemsCtrl',
                resolve: {
                    itemsListData: itemsListData
                }
            });

        itemsListData.$inject = ['itemsService'];
        function itemsListData(itemsService) {
            return itemsService.getItems();
        }
    };
})();