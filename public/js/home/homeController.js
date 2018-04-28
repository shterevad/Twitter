mainApp.controller('postController', function ($scope, PostsService) {
    /* var postRequest = PostsService.getPosts().then(posts => {
        return posts.data;
        $scope.$apply();
    }); */
    $scope.tags = [];
    $scope.links = [];
    $scope.videos = [];
 

    $scope.loadPosts = function () {
        postRequest.then(data=>{
            $scope.posts=data;
            console.log($scope.posts);
        });
    };

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
                return w = "<a href=" + w + ">" + w + "</a>";
            }
            return w;
        });

        return $scope.splited.join(' ');
    }

    $scope.addPost = function () {
        $scope.postText = $scope.filterLinks();
        console.log($scope.postText);

        $scope.newPost = {
            text: $scope.postText,
            tags: $scope.tags,
            links: $scope.links,
            videos: $scope.videos,
            likes: [],
            retweets: [],
            comments: [],
            photos: [],
            giffs: []
        }
        console.log($scope.newPost);

        PostsService.savePost($scope.newPost).then(post => {
            console.log('Succesfully added:' + post.data);
            $scope.posts.push(post.data);
            console.log($scope.posts);
        
        })
    }



});

mainApp.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        var video_id = url.split('v=')[1].split('&')[0];
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_id);
    };
}]);
