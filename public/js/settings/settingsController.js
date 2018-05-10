mainApp.controller('settingsController', function ($scope, $window, $location, $timeout, PostsService, userService) {  
    $scope.settingsSection = 1;
    $scope.userInSettings = userService.getUserInSession();
    $scope.passwordChange = {};
    $scope.hasResponse = false;
    $scope.hasError = false;
    $scope.response = {};
    $scope.profilePicUploaded = false;
    $scope.headerPicUploaded = false;

    $scope.saveProfileChanges = () => {
        userService.updateUserFields({user : $scope.userInSettings})
        .then(response => {
            $scope.userInSettings = response;
            $scope.hasResponse = true;
            $scope.hasError = false;
            $scope.profilePicUploaded = false;
            $scope.headerPicUploaded = false;
            $scope.response = "Your profile has been updated successfully"
        })
        .catch(err => {
            $scope.hasResponse = true;
            $scope.hasError = false;
            $scope.profilePicUploaded = false;
            $scope.response = "Something went wrong. Please try again."
        });
    }

    $scope.changePass = () => {
        $scope.passwordChange.userId =  $scope.userInSettings._id;
        userService.changePass($scope.passwordChange)
        .then(response => {
            $scope.hasResponse = true;
            $scope.hasError = false;
            $scope.response = response.message;
        })
        .catch(err => {
            $scope.hasResponse = true;
            $scope.hasError = true;
            $scope.response = err.message;
        });

        $scope.passwordChange = {}
    }

    $scope.upload = ($event) => {
        let data = {}
        data.file = $event.target.files[0];
        data.name = (+new Date()) + '-' + data.file.name;
        data.metadata = { contentType: data.file.type, auth : "Waffles" };
        userService.uploadPicture(data)
        .then(response => {
            $scope.userInSettings[$event.target.name] = response;
            if($event.target.name == "profilePicture"){
                $scope.profilePicUploaded = true;
            } else {
                $scope.headerPicUploaded = true;
            }

        })
        .catch(err => console.log(err));
    }

});