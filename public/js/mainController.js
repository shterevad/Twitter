mainApp.controller('mainAppController', function ($scope, $http, $location, $window, $timeout, PostsService, userService) {

    if (!sessionStorage.getItem("loggedUser")) {
        $window.location.href = '/login'
    }

    $scope.userInSession = userService.getUserInSession();
    $scope.users = [];
    $scope.conversations = [];
    $scope.messageSection = 1;
    $scope.menuOpened = false;
    $scope.toggleSearch = false;


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


     /* toggle settings menu */
     $scope.toggleMenu = function (event) {
        $scope.menuOpened = !($scope.menuOpened);
        event.stopPropagation();
    };
    
    /* close search bar */
    $scope.closeSearch = function () {
        $scope.search = '';
        $scope.toggleSearch = false;
    }

    /* close all drop-down menus */
    window.onclick = function () {
        $scope.search = '';
       
        if ($scope.menuOpened) {
            $scope.menuOpened = false;
        }
        $scope.$apply();
    };

    /* close all drop-down menus on resize */
    angular.element($window).bind('resize', function () {
        $scope.hiddenSearch = '';
        $scope.toggleSearch = false;
        $scope.$digest();
        $scope.search = '';
    });

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

