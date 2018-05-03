mainApp.controller('followController', function ($scope, $http, userService) {
    userService.getRandomUsers().then(users => {
        userService.getUserInSession()
            .then(function (userInSession) {
                $scope.users = [];
                users.forEach(u => {
                    if (userInSession.following.indexOf(u._id) >= 0) {
                        u.followBack = true;
                    } else {
                        u.followBack = false;
                    };
                    $scope.users.push(u);
                })
            })
            .catch(err => { console.log(err) })
    }).catch(err => { console.log(err) })
});