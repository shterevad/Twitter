mainApp.controller('settingsController', function ($scope, $window, $location, $timeout, PostsService, userService) {

    $scope.settingsSection = 1;
    $scope.userInSettings = userService.getUserInSession();
    
    $scope.saveProfileChanges = () => {
        var updated = userService.updateUserFields({user : $scope.userInSettings});
        // userService.updateUserFields($scope.userInSettings)
        // .then(response => {
        //     console.log(response);
        // })
        // .catch(err => console.log(err));
    }

    $scope.upload = ($event) => {
        let data = {}
        data.file = $event.target.files[0];
        data.name = (+new Date()) + '-' + data.file.name;
        data.metadata = { contentType: data.file.type, auth : "Waffles" };
        userService.uploadPicture(data)
        .then(response => {
            $scope.userInSettings[$event.target.name] = response;
        })
        .catch(err => console.log(err));
    }

});