mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {
    $scope.user = userService.getUserInSession();
    $scope.userInSession = userService.getUserInSession();
    $scope.users = [];
    $scope.conversations = [];
    $scope.sectionInUse = 2;


    $scope.loadUsers = function () {
        userService.getAllUsers().then(users => {
            var loggedUserIndex = users.findIndex(u => u._id == $scope.userInSession._id);
            if (loggedUserIndex != -1) {
                users.splice(loggedUserIndex, 1);
            }
            $scope.users = users;
        })
    }

    $timeout(function () {
    $scope.loadConversations = (function () {
        
            $scope.sectionInUse = 2;
            $scope.userInSession.conversations.forEach(conversation => {
                userService.getUserById(conversation._userId).then(user => {
                    var index = $scope.conversations.findIndex(conv => conv.user._id === conversation._userId);
                    if (index == -1) {
                        $scope.conversations.push({ user: user, messages: conversation.messages });
                        console.log($scope.conversations);
                    }
                })
            });  
    })();
}, 1);
    $scope.expandImage = (pic) => {
        $scope.galleryPic = pic;
    }

    $scope.deleteImage = (pic) => {
        let data = {
            pic : pic,
            userId : $scope.userInSession._id
        }
        console.log(data)
        userService.deleteImage(data)
        // .then(response => console.log(response))
        // .catch(error => console.log(error))
    }

    $scope.openImageNewTab = (pic) => {
        $window.open(pic);
    }
});

mainApp.controller('headerController', function ($scope, userService) {

});


mainApp.controller('mainController', function ($scope) {


});