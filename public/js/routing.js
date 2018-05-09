var mainApp = angular.module("mainApp", ["ngRoute", "ngSanitize", "720kb.tooltips"]);

mainApp.config(function($routeProvider) {
    $routeProvider
   .when("/", {
        templateUrl : "js/home/home.htm",
    }) 
    .when("/profile/:username", {
        templateUrl : "js/profile/profile.htm",
    })
    .when("/tags/:tagName", {
        templateUrl :"js/hashtag/hashtag.htm",
    })  
    .when("/settings", {
        templateUrl : "js/settings/settings.htm",
    })
    .when("/footer/:page", {
        templateUrl : "js/footerPages/footer.htm",
    })
    .otherwise({
        redirectTo: '/'
    });
});
