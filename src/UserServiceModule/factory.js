"use strict";
(function(angular){
    angular.module("UserServiceModule")
        .factory("UserFactory", ["$http", function($http){
            return{
                addUser: function(user){
                    var _route = "/items";
                    $http({
                        url: _route,
                        method: "POST",
                        data: user
                    }).then(
                        function(response){
                            alert("Ok");
                            console.log(response);
                        }, function(response){
                            alert("False");
                            console.log(response)
                        });
                },
                getUsers: function(){
                    var _route = "/items";
                    $http.get(_route).success(
                        function(response) {
                            return response.data;
                        }
                    );

                },
                deleteUser: function(user){

                }
            }

        }]);
})(angular);
