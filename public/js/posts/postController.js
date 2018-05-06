mainApp.controller('postController', function ($scope, PostsService, TrendsService, userService) {
    // get following posts and user posts

    $scope.posts = [];
    $scope.tweetText = '';
    $scope.postUserLikes = [];
    $scope.newPost = {};

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
                toPush.forEach(post => {
                    if ($scope.userInSession.likes.indexOf(post._id) >= 0) {
                        post.liked = true;
                    } else {
                        post.liked = false;
                    };
                })
                $scope.posts = $scope.posts.concat(toPush);
                $scope.posts = PostsService.sortByDateEsc($scope.posts);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    });


    $scope.showLikes = function (post) {
        $scope.post = post;
        var users = [];
        post.likes.forEach(userId => {
            userService.getUserById(userId).then(user => {
                users.push(user);
            })
        })

        $scope.$apply(function () {
            $scope.postUserLikes = users;
        });
    }


    $scope.addPost = function (post) {
        var tags = [],
            links = [],
            videos = [];

        var postText = $scope.filterLinks(post, tags, videos, links);
        var newPost = {
            text: postText,
            _userId: $scope.userInSession._id,
            userName: $scope.userInSession.name,
            userUsername: $scope.userInSession.username,
            tags: tags,
            links: links,
            videos: videos,
            profilePicture: $scope.userInSession.profilePicture
        }

        if($scope.newPost.photo){
            let userToUpdate = userService.getUserInSession();
            userToUpdate.gallery.push($scope.newPost.photo);
            userService.updateUserFields({user : userToUpdate})
            .catch(err => console.log(err));
        }

        $scope.savePost(newPost).then(res => {
            $scope.posts.unshift(res.post);
            $scope.tweetText = ''
        });


    }

    $scope.likePost = (post) => {
        let user = userService.getUserInSession();
        let alreadyLiked = post.likes.findIndex(id => {
            return id == $scope.userInSession._id
        });
        if (alreadyLiked != -1) {
            post.likes.splice(alreadyLiked, 1);
        } else {
            post.likes.push($scope.userInSession._id);
        }

        PostsService.updatePost({ post: post }).then(p => {
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

    }

    $scope.retweetReplyPost = function (post) {
        $scope.post = post;
        $scope.posted = getDate(post.posted);
        console.log($scope.post);
    }


    $scope.replyPost = function (post) {
        console.log(post);
        let reply = {
            text: $scope.tweetText,
            userName: $scope.userInSession.name,
            userUsername: $scope.userInSession.username,
            userPhoto: $scope.userInSession.profilePicture,
            likes: []
        }

        post.replies.push(reply);

        PostsService.updatePost({ post: post }).then(p => {
            console.log(p);
            $('#replyModal').modal('hide');
            $scope.tweetText = '';
        });
    }


    $scope.retweet = function (post) {
        var oldPost = post;
        let newPost = post;

        newPost._id, newPost.likes, newPost.replies, newPost.retweets;

        var tags = [],
            links = [],
            videos = [];

        if (newPost.retweetText) {
            newPost.text += "<div .class='retweets'> " + newPost.retweetText + "</div>";
        }

        newPost.retweetText = $scope.filterLinks($scope.reply, tags, links, videos);

        newPost.videos = newPost.videos.concat(videos);
        newPost.tags = newPost.tags.concat(tags);
        newPost.links = newPost.links.concat(links);
        newPost._userId = $scope.userInSession._id;
        newPost.userName = $scope.userInSession.name;
        $scope.savePost(newPost).then(res => {
            console.log(res.post);
            console.log(oldPost);
            oldPost.retweets.push(res.post);
            PostsService.updatePost({ post: oldPost }).then(p => {
                console.log(p);
            });

            $('#retweetModal').modal('hide');
            newPost = '';
            $scope.reply = '';
        })
    }

    $scope.loadReplies = function (post) {
        $scope.post = post;
        $scope.posted = getDate(post.posted);
        $scope.replies = post.replies;
        console.log($scope.replies);

    }


    $scope.deletePost = function (id) {
        PostsService.removePost(id).then(postId => {
            console.log(postId);
            var postIndex = $scope.posts.findIndex(p => p._id === id);
            var post = $scope.posts.splice(postIndex, 1);
            console.log(post);
            post[0].tags.forEach(tag => {
                TrendsService.getTagByName(tag).then(tag => {
                    console.log(id);
                    var index = tag.posts.findIndex(post => post._id === id)
                    if (index != -1) {
                        post.posts.splice(index, 1);
                    }
                    TrendsService.saveOrUpdateTag(tag).then(t => {
                        console.log(t);
                    });
                })
            })
            let index = $scope.userInSession.posts.findIndex(id => id === postId);
            if (index) {
                $scope.userInSession.posts.splice(index, 1);
            }
            let like = $scope.userInSession.likes.findIndex(id => id === postId);
            if (like) {
                $scope.userInSession.posts.splice(index, 1);
            }
            userService.updateUserFields({ user: $scope.userInSession }).then(user => { userService.updateUserInSession(user.data); }
            );

        })
    }

    $scope.savePost = function (post) {
        return new Promise(function (resolve, reject) {
            PostsService.savePost({ post: post }).then(post => {
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
                resolve(post);
                userService.saveNewPost({ userId: $scope.userInSession._id, post: post.post._id })
                    .then(u => {
                        userService.updateUserInSession(u.data);
                        console.log(u.data);
                    })
                    .catch(err => {
                        console.log(err);
                    });

            }).catch(err => {
                //todo:validation
            });
        })

    }

    $scope.filterLinks = function (post, tags, videos, links) {
        var splited = post.split(' ').map(w => {
            if (/\B#(\d*[A-Za-z_]+\w*)\b(?!;)/g.test(w)) {
                tags.push(w.slice(1));
                return w = `<a href='#!tags/${w.slice(1)}'>` + w + "</a>";
            }
            return w;
        }).map(w => {
            if (/(^https?:\/\/[^\s]+)/g.test(w)) {
                if (/^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/g.test(w)) {
                    videos.push(w);
                }
                links.push(w);
                return w = "<a href='" + w + "' target='_blank'>" + w + "</a>";
            }
            return w;
        });
        return splited.join(' ');
    }

    $scope.upload = ($event) => {
        let data = {}
        data.file = $event.target.files[0];
        data.name = (+new Date()) + '-' + data.file.name;
        data.metadata = { contentType: data.file.type };
        userService.uploadPicture(data)
        .then(response => {
            $scope.newPost.photo = response;
        })
        .catch(err => console.log(err));
    }

});
/* }); */
mainApp.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        var video_id = url.split('v=')[1].split('&')[0];
        return $sce.trustAsResourceUrl("https://www.youtube.com/embed/" + video_id);
    };
}]);



function getDate(date) {
    var date = new Date(date);
    var hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds(),
        hourFormatted = hour % 12 || 12, // hour returned in 24 hour format
        minuteFormatted = minute < 10 ? "0" + minute : minute,
        morning = hour < 12 ? "AM" : "PM";

    return hourFormatted + ":" +
        minuteFormatted + morning + " - " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
}


function search(){
    
}




