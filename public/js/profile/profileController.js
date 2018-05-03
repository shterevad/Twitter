mainApp.controller('profileController', function($scope, $window, $location, PostsService, TrendsService, userService) {
    
    $scope.sectionInUse = 1;
    let pageUserId = $window.location.hash.substring(11);

    // follow user by id
    $scope.followUser = function(event, userToFollowId){
        event.preventDefault();

        userService.followUser(userToFollowId)
        .catch(function(err){
            console.log(err)
        });
    }

    // unfollow user by id
    $scope.unfollowUser = function(event, userToUnfollow){
        event.preventDefault();

        userService.unfollowUser(userToUnfollow).then(function(res){
            console.log(res)
        })
        .catch(function(err){
            console.log(err)
        })
    }


    userService.getUserByUsername(pageUserId).then(function(user){
        userService.getUserInSession().then(function(userInSession){
            if(user._id === userInSession._id){
                $scope.isInSession = false;
            } else {
                $scope.isInSession = true;
            }

            $scope.userProfile = user;
            $scope.gallery = user.gallery;
            $scope.following = [];
            $scope.followers = [];
            $scope.posts=[];

            user.following.forEach(u => {
                userService.getUserById(u).then(function(toPush){
                    if(userInSession.following.indexOf(toPush._id) >= 0){
                        toPush.followBack = true;
                    } else {
                        toPush.followBack = false;
                    };

                    if(u === userInSession._id){
                        toPush.thatsYou = true;   
                    } else {
                        toPush.thatsYou = false;
                    }

                    $scope.following.push(toPush);
                })
            });

            user.followers.forEach(u => {
                userService.getUserById(u).then(function(toPush){
                    
                    if(userInSession.following.indexOf(toPush._id) >= 0){
                        toPush.followBack = true;
                    } else {
                        toPush.followBack = false;
                    };
                    
                    if(u === userInSession._id){
                        toPush.thatsYou = true;   
                    } else {
                        toPush.thatsYou = false;
                    }

                    $scope.followers.push(toPush);
                })
            })


            user.posts.forEach(post=>{
                PostsService.getPostById(post).then(p=>{
                    p.profilePicture = user.profilePicture;
                    $scope.posts.push(p);
                })
            })

        }).catch(err => console.log(err))
       
    });



  
});