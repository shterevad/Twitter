mainApp.controller('followController', function ($scope, $http, userService) {

$scope.users=[];
    $scope.refresh = function(){
        userService.getRandomUsers().then(users => {
            userService.getUserInSession().then(u => {
                u.following.forEach(follower => {
                    users.forEach((u,index)=>{
                        if(u._id===follower){
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
                $scope.users = users;
            })
        });
    };

     $scope.deleteFollow = function(){
        console.log($scope.users);
     }
    
    $scope.refresh();
});