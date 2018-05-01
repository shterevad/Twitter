mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {

    userId = '5ae5a679f2c4112d78d0866a';
    userService.getUserById(userId).then(function(res){
        console.log(res);
    });

    userService.getUserInSession().then(function(user){
        $scope.user=user;
    })
    

   

});

mainApp.controller('headerController', function ($scope) {


});


mainApp.controller('mainController', function ($scope) {


});

// userService.getUserById('5ae5a69f2c4112d78d0866a')
// .then(function(response){
//     console.log(response);
// })
// .catch(function(err){
//     console.log(err)
// });