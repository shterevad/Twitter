mainApp.controller('messagesController', function ($scope, $http, $location, $window, $timeout, userService) {
    $scope.messageToSend='';
    $scope.messages=[];
    $scope.userInSession = userService.getUserInSession();
    $scope.messageSection=1;

    $scope.loadConversations = function () {
        
        console.log($scope.messageSection);    
        $scope.userInSession.conversations.forEach(conversation => {
            userService.getUserById(conversation._userId).then(user => {
                var index = $scope.conversations.findIndex(conv => conv.user._id === conversation._userId);
                if (index == -1) {
                    $scope.conversations.push({ user: user, messages: conversation.messages });
                    console.log($scope.conversations);
                }
            })
        });
    }

    $scope.startConversation = function (user) {
        $scope.messageSection=3;

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

            $scope.messages=$scope.userInSession.conversations[userInSessionMessage].messages;
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
                    $scope.userInSession.conversations[userInSessionMessage].messages.push(message);
                    user.conversations[userMessage].messages.push(message);
                    console.log($scope.userInSession);
                    console.log(user);

                    userService.updateUserFields({user: $scope.userInSession}).then(
                        userService.updateFields({user:user})
                    )
                   
                }   
    
        }
    }
});