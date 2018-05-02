mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {

    userService.getUserInSession().then(function(user){
        $scope.user=user;
    })

    userService.getUserInSession().then(function (user) {
        $scope.user=user;
    });
  
});

mainApp.controller('headerController', function ($scope, userService) {

});


mainApp.controller('mainController', function ($scope) {


});