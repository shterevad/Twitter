mainApp.controller('followController', function ($scope, $http, userService) {
    const FOLLOW_USERS = 3;

    $scope.users = [];
    $scope.refresh = function () {
        userService.getRandomUsers().then(users => {
            $scope.userInSession.following.forEach(follower => {
                users.forEach((u, index) => {
                    if (u._id === follower) {
                        users.splice(index, 1);
                    }
                })
            });
            var userIndex = users.findIndex(usr => {
                return usr._id === $scope.userInSession._id;
            })
            if (userIndex != -1) {
                users.splice(userIndex, 1);
            }
            users.splice(FOLLOW_USERS);
            users.forEach(usr => {
                if ($scope.userInSession.following.indexOf(usr._id) >= 0) {
                    usr.followBack = true;
                } else {
                    usr.followBack = false;
                };
            })
            $scope.users = users;
        });
    };

    $scope.deleteFollow = function (id, $index) {
        $scope.users.splice($index, 1);
    }

    $scope.refresh();

    // follow user by id
    $scope.followUser = function (event, userToFollowId, $index) {
        event.preventDefault();

        userService.followUser(userToFollowId).then(function (res) {
            $scope.users[$index].followBack = true;
        })
            .catch(function (err) {
                alert("Something went wrong! Please try again!");
            });
    }

    // unfollow user by id
    $scope.unfollowUser = function (event, userToUnfollow, $index) {
        event.preventDefault();

        userService.unfollowUser(userToUnfollow).then(function (res) {
            $scope.users[$index].followBack = false;
        })
            .catch(function (err) {
                alert("Something went wrong! Please try again!");
            })
    }


});