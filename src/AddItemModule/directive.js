"use strict";
(function(angular){
    angular.
        module("AddItem")
        .directive("addItem", function(){
            return{
                restrict: "E",
                templateUrl: "src/AddItemModule/template.html"
            }
        });
})(angular);
