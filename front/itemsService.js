/**
 * Created by Yaroslav_Andryushche on 9/24/2015.
 */
(function() {
    angular.module('staffManagementApp')
        .service('itemsService', createService);

    function createService($http) {
        this.addNewItem = addNewItem;
        this.deleteItem = deleteItem;
        this.getItems = getItems;

        function getItems(items) {
            return $http.get('/items').then(function(data){
                return data.data;
            });
        }

        function addNewItem(item) {
            var postData = "";
            var conjunction = "";

            for (field in item) {
                postData += conjunction + field + '=' + encodeURIComponent(item[field]);
                if (conjunction === '')
                    conjunction = "&";

            }

            return $http.post('/items', postData).then(function(data){
                return data.data;
            });
        }

        function deleteItem(id) {
            return $http.delete('/items?id=' + id).then(function(data){
                return data.data;
            });
        }

    }

})();