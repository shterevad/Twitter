
mainApp.controller('messagesController', function ($scope, $http, $location, $window, $timeout, userService) {
    $scope.messageToSend='';
    $scope.messages=[];
    $scope.userInSession = userService.getUserInSession();
    $scope.messageSection=1;

    $scope.changeSection= function(){
        $scope.messageSection=1;
    }

    $scope.loadConversations = function () {
   
        $scope.userInSession.conversations.forEach(conversation => {
            userService.getUserById(conversation._userId).then(user => {
                var index = $scope.conversations.findIndex(conv => conv.user._id === conversation._userId);
                if (index == -1) {
                    $scope.conversations.push({ user: user, messages: conversation.messages });
                }
            })
        });
    }

    $scope.startConversation = function (user) {
        $scope.messageSection=3;
        $conversationUser=user;
        
        var index = user.conversations.findIndex(u=>u._userId===$scope.userInSession._id);
        if (index == -1) {
            user.conversations.push({ _userId: $scope.userInSession._id, messages: [] });
            $scope.userInSession.conversations.push({ _userId: user._id, messages: [] });
            userService.updateFields({ user: user }).then(u => {
             userService.updateUserFields({ user: $scope.userInSession })
            });
        }
            
            var userInSessionMessage = $scope.userInSession.conversations.findIndex(conv=> conv._userId===user._id);
            var userMessage= user.conversations.findIndex(conv=> conv._userId===$scope.userInSession._id);

            $scope.messages=$scope.userInSession.conversations[userInSessionMessage].messages;
            $scope.messages.forEach(message => {
                if(message.userId===$scope.userInSession._id){
                    message.myMessage=true;
                }
            });
            $scope.sendMessage = function(messageToSend){
            
                if(messageToSend){
                    let message={
                        userId:$scope.userInSession._id,
                        profilePic: $scope.userInSession.profilePicture,
                        message: messageToSend,
                    }
                    message.myMessage=true;
                    $scope.userInSession.conversations[userInSessionMessage].messages.push(message);
                    user.conversations[userMessage].messages.push(message);

                    userService.updateUserFields({user: $scope.userInSession}).then(
                        userService.updateFields({user:user}));
                    $scope.loadConversations();
                }   
                messageToSend='';
        }
    }

    $scope.deleteConversation= function(conversation, $index){
       var convIndex= $scope.userInSession.conversations.findIndex(c=>c.userId===conversation.user._id);
        if(convIndex){
            $scope.userInSession.conversations.splice(convIndex, 1);
            userService.updateUserFields({user:$scope.userInSession}).then(u=>{
                $scope.conversations.splice($index,1);
            }).catch(err=>{
                alert("Something went wrong! Please try again later!");
            })
        }
    }

   
});