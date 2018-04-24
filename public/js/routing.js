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
});


mainApp.controller('mainController', function($scope) {
    $event.preventDefault();
    $scope.showProfile =function(){
      angular.element(document.querySelector('.profile-wrapper > ul')).toggle(200);
    }
  });