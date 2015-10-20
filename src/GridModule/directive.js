"use strict";
(function(angular){
    angular.module("GridModule")
        .directive("grid", function(){
            return{
                restrict: "E",
                templateUrl: "src/GridModule/template.html"
            }
        });
})(angular);
