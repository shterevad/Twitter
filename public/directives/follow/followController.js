mainApp.controller('followController', function ($scope, $http, userService) {

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
    

    //load user
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