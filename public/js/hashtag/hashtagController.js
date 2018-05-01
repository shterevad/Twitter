mainApp.controller('hashtagController', function($scope, $http, $location, $window, TrendsService) {

  var tagName=$window.location.hash.substring(10);
  console.log(tagName);
  TrendsService.getTagByName(tagName).then(tag=>{
    $scope.tag=tag;
    console.log($scope.tag);
    });
  
});