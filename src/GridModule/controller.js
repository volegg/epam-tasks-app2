"use strict";
(function(angular){
    angular
        .module("GridModule")
        .controller("GridController", ["UserFactory", function(UserFactory) {
            this.items = UserFactory.getUsers();
            console.log(this.items);
            //this.updateItems = function(){
            //    this.items =  UserFactory.getUsers();
            //};

        }]);
})(angular);
