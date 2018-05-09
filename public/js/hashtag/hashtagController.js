mainApp.controller('hashtagController', function ($scope, $http, $location, $window, TrendsService, PostsService, userService) {
  tagName = $window.location.hash.substring(8);
  $scope.tagPosts = [];

  TrendsService.getTagByName(tagName).then(tag => {
    $scope.tag = tag;

    $scope.getTagPosts = (id) => {
      tagPosts = [];
      $scope.users = [];
      $scope.hashtagVideos = [];
      $scope.hashtagPhotos = [];

      TrendsService.getTagById(id).then(tag => {
        tag.posts.forEach(postId => {
          PostsService.getPostById(postId).then(post => {
            if (post.videos) {
              $scope.hashtagVideos.push(post);
            }

            if (post.photo) {
              $scope.hashtagPhotos.push(post.photo);
            }

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

    $scope.showTopTrends = (id, index) => {
      $scope.hashtagSection = 1;
      $scope.tagPosts = $scope.getTagPosts(id);
      
    }
    $scope.showTopTrends(tag._id);

    $scope.showLatestTrends = (id) => {
      $scope.tagPosts = $scope.getTagPosts(id);
    }
  })
    .catch(err => {
      alert("Something went wrong! Please try again later.")
    })
});



