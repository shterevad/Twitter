mainApp.controller('hashtagController', function($scope, $http, $location, $window, TrendsService) {

  // тук го промених, защото с 18 изтриваше целия референс. първите 8 като се махнат и излиза от началото на тага
  tagName=$window.location.hash.substring(8);
  console.log($window.location.hash.substring(8))
  console.log(tagName);
  
  //тук ти го преработвам, за да търси в таговете с #, но това определено чупи връзката с базата
  // tagName = "#" + tagName;
  
  TrendsService.getTagByName(tagName).then(tag=>{
    $scope.tag=tag;
    console.log($scope.tag);
    })
    .catch(err=>{
      console.log(err);
    })
  
});