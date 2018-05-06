mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {
    $scope.user = userService.getUserInSession();
    $scope.userInSession = userService.getUserInSession();
    $scope.users = [];
    $scope.conversations=[];
   
    $scope.newConversationRequest=false;



    $scope.loadUsers = function () {
        userService.getAllUsers().then(users => {
            var loggedUserIndex = users.findIndex(u => u._id == $scope.userInSession._id);
            if (loggedUserIndex != -1) {
                users.splice(loggedUserIndex, 1);
            }
            $scope.users = users;
        })
    }


    $scope.loadConversations = function(){

        $scope.userInSession.conversations.forEach(conversation => {
            console.log(conversation);
            userService.getUserById(conversation._userId).then(user=>{
                var index= $scope.conversations.findIndex(conv=>conv.user._id===conversation._userId);
                if(index==-1){
                    $scope.conversations.push({user:user, messages: conversation.messages});
                }
                
                console.log($scope.conversations);
            })
        });
    }

});

mainApp.controller('headerController', function ($scope, userService) {

});


mainApp.controller('mainController', function ($scope) {


});