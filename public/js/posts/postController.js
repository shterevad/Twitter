mainApp.controller('postController', function ($scope, PostsService, TrendsService, userService) {
    
    // get following posts and user posts
    $scope.posts = [];
    
    var followingIds = $scope.userInSession.following.slice();
    followingIds.push($scope.userInSession._id);

    followingIds.forEach(id => {
        userService.getFollowing(id).then(user => {
            PostsService.getPostsByUserId(user._id).then(userPosts => {
                let toPush = [];
                userPosts.forEach(p => {
                    p.userUsername = user.username;
                    p.profilePicture = user.profilePicture;
                    toPush.push(p);
                })
                $scope.posts = $scope.posts.concat(toPush);
                $scope.posts = PostsService.sortByDateEsc($scope.posts);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    })
    
    $scope.addPost = function () {
      
        $scope.tags = [];
        $scope.links = [];
        $scope.videos = [];

        $scope.filterLinks = function () {
            $scope.splited = $scope.tweetText.split(' ').map(w => {
                if (/\B#(\d*[A-Za-z_]+\w*)\b(?!;)/g.test(w)) {
                    $scope.tags.push(w.slice(1));
                    return w = `<a href='#!tags/${w.slice(1)}'>` + w + "</a>";
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
        $scope.postText = $scope.filterLinks();
        $scope.newPost = {
            text: $scope.postText,
            _userId: $scope.userInSession._id,
            userName: $scope.userInSession.name,
            tags: $scope.tags,
            links: $scope.links,
            videos: $scope.videos,
            profilePicture: $scope.userInSession.profilePicture
        }

        PostsService.savePost({ post: $scope.newPost }).then(post => {
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
            userService.saveNewPost({ userId: $scope.userInSession._id, post: post.post._id })
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
    }

    $scope.post = null;
    $scope.likePost = (id) => {
        let user = userService.getUserInSession();
        PostsService.getPostById(id).then(post => {
            var post = post;
            let alreadyLiked = post.likes.findIndex(id => {
                return id == $scope.userInSession._id
            });
            if (alreadyLiked != -1) {
                post.likes.splice(alreadyLiked, 1);
            } else {
                post.likes.push($scope.userInSession._id);
            }

            PostsService.savePost({ post: post }).then(p => {
                let alreadyLiked = $scope.userInSession.likes.findIndex(id => id === p.data._id);
                if (alreadyLiked != -1) {
                    $scope.userInSession.likes.splice(alreadyLiked, 1);
                } else {
                    $scope.userInSession.likes.push(p.data._id);
                }

                userService.updateUserFields({ user: $scope.userInSession }).then(u => {
                    console.log("Succesfully liked/unliked");
                })
            })
        })
    }

    $scope.retweetReplyPost = function (post) {
  
        $scope.post = post;
        console.log($scope.post);
    }

    
    $scope.saveRetweet = function(post){


    }

});
/* }); */

mainApp.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        var video_id = url.split('v=')[1].split('&')[0];
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_id);
    };
}]);
