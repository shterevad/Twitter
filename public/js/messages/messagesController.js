mainApp.controller('messagesController', function ($scope, $http, $location, $window, $timeout, userService) {
    $scope.messageToSend='';
    $scope.started = false;
    $scope.messages=[];
    $scope.userInSession = userService.getUserInSession();
    $scope.messageSection=1;
    $scope.startConversation = function (user) {
        $scope.messageSection=3;
        $scope.started = true;
        console.log(user);
        console.log($scope.userInSession);
        $conversationUser=user;
        var index = user.conversations.findIndex(u=>u._userId===$scope.userInSession._id);
        if (index == -1) {
            user.conversations.push({ _userId: $scope.userInSession._id, messages: [] });
            $scope.userInSession.conversations.push({ _userId: user._id, messages: [] });
            userService.updateFields({ user: user }).then(u => {
             userService.updateUserFields({ user: $scope.userInSession })
            });
            console.log('neshto');
        }
            
      

            console.log($scope.userInSession);
            console.log(user);
            var userInSessionMessage = $scope.userInSession.conversations.findIndex(conv=> conv._userId===user._id);
            var userMessage= user.conversations.findIndex(conv=> conv._userId===$scope.userInSession._id);

            $scope.messages=$scope.userInSession.conversations[userInSessionMessage].messages.reverse();
            $scope.messages.forEach(message => {
                if(message.userId===$scope.userInSession._id){
                    message.myMessage=true;
                }
            });
            $scope.sendMessage = function(messageToSend){
            
                console.log($scope.userInSession);
                console.log(user);
                console.log($scope.messageToSend);
                if(messageToSend){
                    let message={
                        userId:$scope.userInSession._id,
                        profilePic: $scope.userInSession.profilePicture,
                        message: messageToSend,
                    }
                    console.log($scope.messageToSend);
                    $scope.userInSession.conversations[userInSessionMessage].messages.unshift(message);
                    user.conversations[userMessage].messages.unshift(message);
                    console.log($scope.userInSession);
                    console.log(user);

                    userService.updateUserFields({user: $scope.userInSession}).then(
                        userService.updateFields({user:user})
                    )
                    $scope.messageToSend='';
                }   
            
        }
    }
});