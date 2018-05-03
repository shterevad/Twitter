mainApp.controller('hashtagController', function($scope, $http, $location, $window, TrendsService, PostsService, userService) {
  tagName=$window.location.hash.substring(8);
  TrendsService.getTagByName(tagName).then(tag=>{
    $scope.tag=tag;
    })
    .catch(err=>{
      console.log(err);
    })
  

    $scope.showLatestTrends = (id) =>{
      $scope.posts=[];
        TrendsService.getTagById(id).then(tag=>{
          tag.posts.forEach(postId=>{
            PostsService.getPostById(postId).then(post=>{
              userService.getUserById(post._userId).then(user=>{
                post.profilePicture = user.profilePicture;  
              }) 
              $scope.posts.push(post);
            })
            
          })
        })
    }
});