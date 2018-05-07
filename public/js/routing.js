var mainApp = angular.module("mainApp", ["ngRoute", "ngSanitize", "720kb.tooltips"]);


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
    .when("/profile/:username", {
        templateUrl : "js/profile/profile.htm",
        requireAuth: true
    })
    .when("/tags/:tagName", {
        templateUrl :"js/hashtag/hashtag.htm",
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

mainApp.run([
    '$rootScope',
    function($rootScope) {
      // see what's going on when the route tries to change
      $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
        // both newUrl and oldUrl are strings
        console.log('Starting to leave %s to go to %s', oldUrl, newUrl);
      });
    }
  ]); 