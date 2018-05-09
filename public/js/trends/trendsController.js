mainApp.controller('trendsController', function ($scope, TrendsService, PostsService) {

    $scope.refreshTags = () => {
        TrendsService.getRandomTags().then(tags => {
            $scope.tags = tags;
        })
    }
    $scope.refreshTags();
});