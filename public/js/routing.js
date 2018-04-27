var mainApp = angular.module("mainApp", ["ngRoute"/* , "infinite-scroll" */]);

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
    .when("/settings", {
        templateUrl : "js/settings/settings.htm"
    })
});

