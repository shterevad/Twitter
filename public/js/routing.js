var mainApp = angular.module("mainApp", ["ngRoute"]);


mainApp.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "js/home/home.htm"
    })
    .when("/notifications", {
        templateUrl : "js/notifications/notifications.htm"
    })
    .when("/profile", {
        templateUrl : "js/profile/profile.htm"
    })
    .when("/hashtag", {
        templateUrl : "js/hashtag/hashtag.htm"
    })
});


mainApp.controller('mainController', function($scope) {
 

  });