mainApp.controller('postController', function ($scope, PostsService, TrendsService, userService) {
    PostsService.getPosts().then(data => {
        $scope.posts = data.reverse();

        console.log($scope.posts);
        $scope.tags = [];
        $scope.links = [];
        $scope.videos = [];
        $scope.filterLinks = function () {
            $scope.splited = $scope.tweetText.split(' ').map(w => {
                if (/\B#(\d*[A-Za-z_]+\w*)\b(?!;)/g.test(w)) {
                    $scope.tags.push(w);
                    return w = "<a href=''>" + w + "</a>";
                }
                return w;
            }).map(w => {
                if (/(^https?:\/\/[^\s]+)/g.test(w)) {
                    if (/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/g.test(w)) {
                        $scope.videos.push(w);
                    }
                    $scope.links.push(w);
                    return w = "<a href='" + w + "' target='_blank'>" + w + "</a>";
                }
                return w;
            });

            return $scope.splited.join(' ');
        }



        $scope.addPost = function () {

            userService.getUserInSession().then(function (user) {
                $scope.user = user;
                $scope.postText = $scope.filterLinks();

                $scope.newPost = {
                    text: $scope.postText,
                    _userId: $scope.user._id,
                    userName: $scope.user.name,
                    tags: $scope.tags,
                    links: $scope.links,
                    videos: $scope.videos,
                }
                console.log($scope.user);
                PostsService.savePost($scope.newPost).then(post => {
                    var post = post.data;
                    if (post.post.tags.length > 0) {
                        for (var i = 0; i < post.post.tags.length; i++) {
                            let tag = {
                                title: post.post.tags[i],
                                posts: [post.post._id]
                            };
                            TrendsService.saveOrUpdateTag(tag).then(tag => console.log());
                        }
                    }
                    userService.saveNewPost({ userId: $scope.user._id, post: post.post._id })
                        .then(post => console.log(post.data))
                        .catch(err => {
                            console.log(err);
                        });
                    $scope.posts.unshift(post.post);
                    $scope.tags = [];
                    $scope.tweetText = '';
                }).catch(err => {
                    //todo:validation
                });
            });

        }
    })
});

mainApp.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        var video_id = url.split('v=')[1].split('&')[0];
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_id);
    };
}]);
