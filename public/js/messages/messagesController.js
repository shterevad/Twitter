mainApp.controller('messagesController', function ($scope, $http, $location, $window, $timeout, userService) {
    
    $scope.startConversation = function (user) {
        $scope.messages=[];
        $scope.sectionInUse = 3;
        $scope.messageToSend='';
        console.log(user);
        console.log($scope.userInSession);

        var index = user.conversations.findIndex(u=>u._userId===$scope.userInSession._id);
        if (index == -1) {
            user.conversations.push({ _userId: $scope.userInSession._id, messages: [] });
            $scope.userInSession.conversations.push({ _userId: user._id, messages: [] });
            userService.updateUserFields({ user: user }).then(u => {
             userService.updateUserFields({ user: $scope.userInSession })
            });
            console.log('neshto');
        } else {
            var userInSessionMessage = $scope.userInSession.conversations.findIndex(conv=> conv._userId===user._id);
            var userMessage= user.conversations.findIndex(conv=> conv._userId===$scope.userInSession._id);

            $scope.messages=$scope.userInSession.conversations[userInSessionMessage].messages;

            $scope.sendMessage = function(){
                if($scope.messageToSend){
                    let message={
                        profilePic:$scope.userInSession.profilePicture,
                        message: $scope.messageToSend
                    }
                    $scope.userInSession.conversations[userInSessionMessage].messages.push(message);
                    user.conversations[userMessage].messages.push(message);
                    userService.updateUserFields({user: $scope.userInSession}).then(u=>{
                        console.log(u);
                        userService.updateUserFields({user:user}).then(usr=>{
                            console.log(usr);
                            $scope.messages.push(message);
                            $scope.messageToSend='';
                        }
                            
                        )
                    })

                }

                
                
            }
        }
    }
});