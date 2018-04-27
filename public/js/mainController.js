mainApp.controller('mainAppController', function($scope, PostsService){
    
    $scope.loadPosts = function(){
        PostsService.getPosts().then(posts => {
           $scope.posts = posts.data;
        })
    }

});


mainApp.controller('headerController', function($scope) {
 

});


mainApp.controller('mainController', function($scope) {


});