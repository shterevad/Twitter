mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {
    $scope.userInSession = userService.getUserInSession();
    $scope.users = [];
    $scope.conversations = [];
    $scope.menuOpened = false;


    $scope.toggleMenu = function (event) {
        $scope.menuOpened = !($scope.menuOpened);
        event.stopPropagation();
    };

    window.onclick = function () {
        if ($scope.menuOpened) {
            $scope.menuOpened = false;
            $scope.$apply();
        }
    };

    $scope.loadUsers = function ($event) {
        userService.getAllUsers().then(users => {
            var loggedUserIndex = users.findIndex(u => u._id == $scope.userInSession._id);
            if (loggedUserIndex != -1) {
                users.splice(loggedUserIndex, 1);
            }
            $scope.users = users;
        })
    }

    $scope.expandImage = (pic) => {
        $scope.galleryPic = pic;
    }

    $scope.deleteImage = (pic) => {
        let data = {
            pic: pic,
            user: userService.getUserInSession()
        }
        userService.deleteImage(data)
            .then(response => {
                $scope.userInSession = userService.getUserInSession();
            })
            .catch(error => console.log(error))
    }

    $scope.openImageNewTab = (pic) => {
        $window.open(pic);
    }
});




// MainApp Filters
mainApp.filter('unique', function () {
    return function (collection, keyname) {
        var output = [],
            keys = [];
        angular.forEach(collection, function (item) {
            var key = item[keyname];
            if (keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
            }
        });
        return output;
    };
});


mainApp.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        var video_id = url.split('v=')[1].split('&')[0];
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_id);
    };
}]);

