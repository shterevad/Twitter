mainApp.controller('trendsController', function ($scope, TrendsService, PostsService) {
    TrendsService.getRandomTags().then(tags =>{
        $scope.tags=tags;
     
    })
});