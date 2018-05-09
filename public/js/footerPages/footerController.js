mainApp.controller("footerController", function($scope, $window, $http){
    let footerPage = $window.location.hash.substring(10);
    console.log(footerPage)

    $http.get("/footer/foot/" + footerPage)
    .then(response => {
        let data = response.data[footerPage];
        if(data){
            $scope.footerContent = data;
        } else {
            $window.location.href = "/"
        }
        
    })
    .catch(err => console.log(err))


})