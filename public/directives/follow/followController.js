mainApp.controller('followController', function ($scope, $http, userService) {

    $scope.users = [];
    $scope.refresh = function () {
        userService.getRandomUsers().then(users => {
            let u = userService.getUserInSession();
            u.following.forEach(follower => {
                users.forEach((u, index) => {
                    if (u._id === follower) {
                        users.splice(index, 1);
                    }
                })
            });

            var userIndex = users.findIndex(usr => {
                return usr._id === u._id;
            })
            if (userIndex) {
                users.splice(userIndex, 1);
            }
            users.splice(3);

            users.forEach(usr => {
                if (u.following.indexOf(usr._id) >= 0) {
                    usr.followBack = true;
                } else {
                    usr.followBack = false;
                };
            })

            $scope.users = users;
        });
    };

    $scope.deleteFollow = function () {
        console.log($scope.users);
    }

    $scope.refresh();

    // follow user by id
    $scope.followUser = function (event, userToFollowId) {
        event.preventDefault();

        userService.followUser(userToFollowId)
            .catch(function (err) {
                console.log(err)
            });
    }

    // unfollow user by id
    $scope.unfollowUser = function (event, userToUnfollow) {
        event.preventDefault();

        userService.unfollowUser(userToUnfollow).then(function (res) {
            console.log(res)
        })
            .catch(function (err) {
                console.log(err)
            })
    }



    // //load user
    // userService.getRandomUsers().then(users => {
    //     userService.getUserInSession()
    //         .then(function (userInSession) {
    //             $scope.users = [];
    //             users.forEach(u => {
    //                 if (userInSession.following.indexOf(u._id) >= 0) {
    //                     u.followBack = true;
    //                 } else {
    //                     u.followBack = false;
    //                 };
    //                 $scope.users.push(u);
    //             })
    //         })
    //         .catch(err => { console.log(err) })
    // }).catch(err => { console.log(err) })
});