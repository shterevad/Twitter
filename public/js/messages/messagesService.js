mainApp.service('messagesService', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {

    $scope.startConversation=function(user){
        console.log(user);
    }


});