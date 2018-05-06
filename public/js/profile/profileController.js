mainApp.controller('profileController', function ($scope, $window, $location, $timeout, PostsService, TrendsService, userService) {

    $scope.sectionInUse = 1;
    $scope.isFollowing = 0;
    let pageUser = $window.location.hash.substring(11);
    let userInSession = userService.getUserInSession();

    userService.getUserByUsername(pageUser).then(function (user) {
        if (user._id === userInSession._id) {
            $scope.isInSession = true;
            $scope.isFollowing;
        } else {
            $scope.isInSession = false;
            if(userInSession.following.indexOf(user._id) >= 0){
                $scope.isFollowing = 1;
            } else {
                $scope.isFollowing = 2;
            }
        }

        $scope.userProfile = user;
        $scope.gallery = user.gallery;
        $scope.following = [];
        $scope.followers = [];
        $scope.posts = [];
        $scope.likes = [];

        user.following.forEach(u => {
            userService.getUserById(u).then(function (toPush) {
                
                if (userInSession.following.indexOf(u) >= 0) {
                    toPush.followBack = 1;
                } else {
                    toPush.followBack = 2;
                };
                
                if (u === userInSession._id) {
                    toPush.followBack = 0;
                }

                $scope.following.push(toPush);
            })
        });

        user.followers.forEach(u => {
            userService.getUserById(u).then(function (toPush) {
                if (userInSession.following.indexOf(u) >= 0) {
                    toPush.followBack = 1;
                } else {
                    toPush.followBack = 2;
                };

                if (u === userInSession._id) {
                    toPush.followBack = 0;
                } 

                $scope.followers.push(toPush);
            })
        })

        user.posts.forEach(post => {
            PostsService.getPostById(post).then(p => {
                p.userUsername = user.username;
                p.profilePicture = user.profilePicture;
                $scope.posts.push(p);
                $scope.posts = PostsService.sortByDateEsc($scope.posts);
            });
        });

        user.likes.forEach(like => {
            console.log(user.likes)
            PostsService.getPostById(like).then(l => {
                $scope.likes.push(l);
                $scope.likes = PostsService.sortByDateEsc($scope.likes);
            });
            console.log($scope.likes);
        });

    });

        // follow user by id
        $scope.followUser = function ($event, userToFollowId, $index) {
            $event.preventDefault();
            
            userService.followUser(userToFollowId).then(res => {
                userService.getUserById(userToFollowId).then(function (toPush) {
                    $scope.following[$index].followBack = 1;
                }).catch(err => {
                    console.log(err);
                })
            })
                .catch(function (err) {
                    console.log(err)
                });
        }
    
        // unfollow user by id
        $scope.unfollowUser = function (event, userToUnfollow, $index) {
            event.preventDefault();

            userService.unfollowUser(userToUnfollow).then(function (res) {
                userService.getUserById(userToUnfollow).then(function (toPush) {
                    $scope.following[$index].followBack = 2;
                }).catch(err => {
                    console.log(err);
                })
            })
                .catch(function (err) {
                    console.log(err)
                })
        }

        $scope.goToSettings = ($event) => {
            $event.preventDefault();
            $window.location.href = "/#!/settings";
        }
    
});