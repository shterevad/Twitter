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


    userService.getUserById(pageUserId).then(function(user){
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
        }).catch(err => console.log(err))
       
    });
  
});