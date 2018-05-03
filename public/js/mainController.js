mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {
    $scope.user = userService.getUserInSession();
    $scope.userInSession = userService.getUserInSession();
});

mainApp.controller('headerController', function ($scope, userService) {

});


mainApp.controller('mainController', function ($scope) {


});