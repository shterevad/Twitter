mainApp.controller('followController', function ($scope, $http, userService) {
    userService.getRandomUsers().then(users =>{
        $scope.users=users;
    })
});