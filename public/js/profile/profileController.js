mainApp.controller('profileController', function($scope, $window, $location, PostsService, TrendsService, userService) {
    
    $scope.sectionInUse = 1;
    let userInSession = "";

    $scope.checkUser = function(idToCheck){
        userService.checkIfUserIsInSession(idToCheck)
        .then(function(response){
            $scope.isInSession = true;
        })
        .catch(function(err){
            $scope.isInSession = false;
        })
    }


    userService.getUserInSession().then(function(user){
        userInSession = JSON.parse(JSON.stringify(user));
        $scope.userProfile = user;
        $scope.checkUser(user._id);
        $scope.gallery = user.gallery;
        $scope.following = [];
        user.following.forEach(u => {
            userService.getUserById(u).then(function(toPush){
                if(toPush.following.indexOf(user._id) >= 0){
                    toPush.followBack = true;
                } else {
                    toPush.followBack = false;
                };
                
                $scope.following.push(toPush);
            })
        })
    });

    // console.log($window.location.hash.substring(11));
});