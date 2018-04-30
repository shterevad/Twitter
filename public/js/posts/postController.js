mainApp.controller('postController', function ($scope, PostsService, TrendsService) {
    PostsService.getPosts().then(data => {
        $scope.posts = data.reverse();
        console.log(data);
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
            $scope.postText = $scope.filterLinks();
            $scope.newPost = {
                text: $scope.postText,
                user: null,
                tags: $scope.tags,
                links: $scope.links,
                videos: $scope.videos,
                likes: [],
                retweets: [],
                replies: [],
                photo: '',
                giffs: []
            }

            PostsService.savePost($scope.newPost).then(post => {
                console.log('Succesfully added:', post.data);
                var post = post.data;
                console.log(post.post.tags.length);
                if (post.post.tags.length > 0) {
                    for (var i = 0; i < post.post.tags.length; i++) {
                        console.log(post.post.tags[i]);
                        let tag = {
                            title:post.post.tags[i],
                            posts:[post.post._id]
                        };
                        TrendsService.saveOrUpdateTag(tag).then(tag => console.log(tag.data));
                        tag={};
                    }
                }
                $scope.posts.unshift(post.post);
                $scope.tags=[];
                $scope.tweetText='';
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
