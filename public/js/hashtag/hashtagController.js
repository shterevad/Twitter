mainApp.controller('hashtagController', function ($scope, $http, $location, $window, TrendsService, PostsService, userService) {
  tagName = $window.location.hash.substring(8);
  console.log($scope.posts);
  TrendsService.getTagByName(tagName).then(tag => {
    $scope.tag = tag;
    $scope.show=true;
    console.log($scope.userInSession);

    $scope.getTagPosts = (id) => {
      tagPosts = [];
      $scope.users=[];
      TrendsService.getTagById(id).then(tag => {
        tag.posts.forEach(postId => {
          PostsService.getPostById(postId).then(post => {
            tagPosts.push(post);
            userService.getUserById(post._userId).then(user => {
              post.userUsername = user.username;
              post.profilePicture = user.profilePicture;
              $scope.users.push(user);
            })
          })
        })
      });
      return tagPosts;
    } 

     $scope.showTopTrends = (id) => { 
      $scope.tagPosts=[];
     
      $scope.tagPosts = $scope.getTagPosts(id);
      console.log($scope.tagPosts);
      
    }
    
    $scope.showTopTrends($scope.tag._id);

    $scope.showLatestTrends = (id) => {
      $scope.tagPosts=[];
      $scope.tagPosts = $scope.getTagPosts(id); 
    }

    $scope.showPeople = () => {
      $scope.show=!$scope.show;
    } 
 })
    .catch(err => {
      console.log(err);
    }) 
});


function sortByLikesAsc(data) {
  data.sort((d1, d2) => {
    if (d1.likes.length < d2.likes.length)
      return -1;
    if (d1.likes.length > d2.likes.length)
      return 1;
    return 0;
  })
}
