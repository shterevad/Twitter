mainApp.controller('profileController', function ($scope, $window, $location, $timeout, PostsService, TrendsService, userService) {
    const SETTINGS_BUTTON_INDEX = 0;
    const UNFOLLOW_BUTTON_INDEX = 1;
    const FOLLOW_BUTTON_INDEX = 2;
    const POSTS_SECTION_INDEX = 1;
    const FOLLOWING_SECTION_INDEX = 1;
    const FOLLOWERS_SECTION_INDEX = 1;
    const LIKES_SECTION_INDEX = 1;

    $scope.sectionInUse = POSTS_SECTION_INDEX;
    $scope.isFollowing = SETTINGS_BUTTON_INDEX;
    let pageUser = $window.location.hash.substring(11);
    let userInSession = userService.getUserInSession();

    userService.getUserByUsername(pageUser).then(function (user) {
        if (user._id === userInSession._id) {
            $scope.isInSession = true;
            $scope.isFollowing = SETTINGS_BUTTON_INDEX;
        } else {
            $scope.isInSession = false;
            if(userInSession.following.indexOf(user._id) >= 0){
                $scope.isFollowing = UNFOLLOW_BUTTON_INDEX;
            } else {
                $scope.isFollowing = FOLLOW_BUTTON_INDEX;
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
                    toPush.followBack = UNFOLLOW_BUTTON_INDEX;
                } else {
                    toPush.followBack = FOLLOW_BUTTON_INDEX;
                };
                
                if (u === userInSession._id) {
                    toPush.followBack = SETTINGS_BUTTON_INDEX;
                }

                $scope.following.push(toPush);
            })
        });

        user.followers.forEach(u => {
            userService.getUserById(u).then(function (toPush) {
                if (userInSession.following.indexOf(u) >= 0) {
                    toPush.followBack = UNFOLLOW_BUTTON_INDEX;
                } else {
                    toPush.followBack = FOLLOW_BUTTON_INDEX;
                };

                if (u === userInSession._id) {
                    toPush.followBack = SETTINGS_BUTTON_INDEX;
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
            PostsService.getPostById(like).then(l => {
                $scope.likes.push(l);
                $scope.likes = PostsService.sortByDateEsc($scope.likes);
            });
        });

    });

        // follow user by id
        $scope.followUser = function ($event, userToFollowId, $index) {
            $event.preventDefault();
            
            userService.followUser(userToFollowId).then(res => {
                userService.getUserById(userToFollowId).then(function (toPush) {
                    console.log($scope.following[$index])
                    $scope.following[$index].followBack = UNFOLLOW_BUTTON_INDEX;
                    // userInSession.following.push()
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
                    $scope.following[$index].followBack = FOLLOW_BUTTON_INDEX;
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