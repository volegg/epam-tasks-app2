"use strict";
(function(angular){
    angular
        .module("GridModule")
        .controller("GridController", ["UserFactory", function(UserFactory) {
            var self = this;
            this.items = [];

            (function updateItems(){
                var promise = UserFactory.getUsers();
                promise.then(function(pass){
                    self.items = pass.data;
                })
            })()

        }]);
})(angular);
