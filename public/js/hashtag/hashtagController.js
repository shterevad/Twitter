mainApp.controller('hashtagController', function ($scope, $http, $location, $window, TrendsService, PostsService, userService) {
  tagName = $window.location.hash.substring(8);
  console.log($scope.posts);
  TrendsService.getTagByName(tagName).then(tag => {
    $scope.tag = tag;
    $scope.show=true;

    $scope.getTagPosts = (id) => {
      $scope.posts = [];
      $scope.users=[];
      TrendsService.getTagById(id).then(tag => {
        tag.posts.forEach(postId => {
          PostsService.getPostById(postId).then(post => {
            $scope.posts.push(post);
            userService.getUserById(post._userId).then(user => {
              post.userUsername = user.username;
              post.profilePicture = user.profilePicture;
              $scope.users.push(user);
            })
          })
        })
      });
      return $scope.posts;
    } 

     $scope.showTopTrends = (id) => {
      $scope.show=true;
      $scope.showTop=true;
      $scope.posts=[];
     
      $scope.posts = $scope.getTagPosts(id);
      
      
    }
    
    $scope.showTopTrends($scope.tag._id);

    $scope.showLatestTrends = (id) => {
      $scope.show=true;
      $scope.posts=[];
      $scope.posts = $scope.getTagPosts(id); 
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
