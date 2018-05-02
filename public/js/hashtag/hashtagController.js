mainApp.controller('hashtagController', function($scope, $http, $location, $window, TrendsService) {

  tagName=$window.location.hash.substring(18);
  console.log(tagName);
  TrendsService.getTagByName(tagName).then(tag=>{
    $scope.tag=tag;
    console.log($scope.tag);
    });
  
});