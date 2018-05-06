mainApp.controller('messagesController', function ($scope, $http, $location, $window, $timeout, userService) {
    $scope.startConversation = function (user) {
        $scope.started = true;
        console.log(user);
        console.log($scope.userInSession);

        var index = user.conversations.findIndex(u=>u.user===$scope.userInSession._id);
        console.log(index);
        if (index == -1) {
            user.conversations.push({ _userId: $scope.userInSession._id, messages: [] });
            $scope.userInSession.conversations.push({ _userId: user._id, messages: [] });

            userService.updateUserFields({ user: user }).then(u => {
                console.log(u);
                console.log($scope.userInSession);
                userService.updateUserFields({ user: $scope.userInSession }).then(user => {
                    userService.updateUserInSession(user.data); 
                })
            });
        }
    }
});