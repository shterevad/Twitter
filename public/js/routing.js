var mainApp = angular.module("mainApp", ["ngRoute", "ngSanitize"]);

mainApp.config(function($routeProvider) {
    $routeProvider
   .when("/", {
        templateUrl : "js/home/home.htm",
        requireAuth: true
    }) 
    .when("/notifications", {
        templateUrl : "js/notifications/notifications.htm",
        requireAuth: true
    })
    .when("/profile", {
        templateUrl : "js/profile/profile.htm",
        requireAuth: true
    })
    .when("/hashtag", {
        templateUrl : "js/hashtag/hashtag.htm",
        requireAuth: true
    })
    .when("/settings", {
        templateUrl : "js/settings/settings.htm",
        requireAuth: true
    })
    .otherwise({
        redirectTo: '/'
    });
});

