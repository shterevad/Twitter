mainApp.controller('settingsController', function ($scope, $window, $location, $timeout, PostsService, userService) {

    $scope.settingsSection = 1;
    $scope.userInSettings = userService.getUserInSession();
    
    // let config = {
    //     apiKey: "AIzaSyDjF-wLRhxCVm2CKOG89G05-AzrYS6Ztog",
    //     authDomain: "twitter-project-6abd2.firebaseapp.com",
    //     databaseURL: "https://twitter-project-6abd2.firebaseio.com",
    //     projectId: "twitter-project-6abd2",
    //     storageBucket: "",
    //     messagingSenderId: "827549512821"
    //   };
    // firebase.initializeApp(config);
    // let storage = firebase.storage();
    // let storageRef = firebase.storage.ref();

    $scope.saveProfileChanges = () => {
        console.log($scope.userInSettings);
        // console.log($scope.myFile)
    }

    $scope.upload = ($event) => {
        let data = {}
        data.file = $event.target.files[0];
        data.name = (+new Date()) + '-' + file.name;
        data.metadata = { contentType: file.type };
        userService.uploadPicture(data);
        // console.log(document.querySelector('#account-profile-picture').files[0])
        // $scope.userInSettings.profilePicture = $event.target.files[0];
    }
});