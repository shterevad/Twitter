mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {
    $scope.userInSession = userService.getUserInSession();
    $scope.users = [];
    $scope.conversations = [];
    $scope.messageSection=1;
   

/*     window.onclick = function() {
        if ($scope.search) {
            $scope.search = '';
            $scope.$apply();
        }
    };  */


    $scope.loadUsers = function ($event) {
        userService.getAllUsers().then(users => {
            var loggedUserIndex = users.findIndex(u => u._id == $scope.userInSession._id);
            if (loggedUserIndex != -1) {
                users.splice(loggedUserIndex, 1);
            }
            $scope.users = users;
        })
    }

   
    $scope.loadConversations = function () {
        $scope.messageSection=1;
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

mainApp.controller('headerController', function ($scope, $location) {
    $scope.menuOpened = false;

    $scope.toggleMenu = function(event) {
        $scope.menuOpened = !($scope.menuOpened);
        event.stopPropagation();
    };

    window.onclick = function() {
        if ($scope.menuOpened) {
            $scope.menuOpened = false;
            $scope.$apply();
        }
    };
});


mainApp.controller('mainController', function ($scope) {


});