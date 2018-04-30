mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {

userService.checkUserInSession().then(function(res){
    console.log(res)
}).catch(function(err){
    console.log(err.status)
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