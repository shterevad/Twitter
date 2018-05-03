mainApp.controller('mainAppController', function ($scope, $rootScope, $http, $location, $window, $timeout, PostsService, userService) {

    userService.getUserInSession().then(function(user){
        $scope.user=user;
    })


  
});

mainApp.controller('headerController', function ($scope, userService) {

});


mainApp.controller('mainController', function ($scope) {


});