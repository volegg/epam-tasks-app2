"use strict";
(function(angular){
    angular
        .module("AddItem")
        .controller("AddItemController", ["UserFactory", function(UserFactory){
            this.newItem = {};
            this.addItem = function(){
                UserFactory.addUser(this.newItem);
                this.newItem = {};
            }
        }]);
})(angular);
