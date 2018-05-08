mainApp.controller('postController', function ($scope, PostsService, TrendsService, userService) {
    // get following posts and user posts
    /* $scope.tags=[]; */
    $scope.posts = [];
    $scope.newPost = {};
    $scope.userInSession = userService.getUserInSession();

    var followingIds = $scope.userInSession.following.slice();
    followingIds.push($scope.userInSession._id);

    followingIds.forEach(id => {
        userService.getFollowing(id).then(user => {
            PostsService.getPostsByUserId(user._id).then(userPosts => {
                let toPush = [];
                userPosts.forEach(p => {
                    p.likes.forEach(like=>{
                        if(like===$scope.userInSession._id){
                            p.liked = true;
                        }else {
                            p.liked = false;
                        }
                    })
                    p.userUsername = user.username;
                    p.profilePicture = user.profilePicture;
                    toPush.push(p);
                });


                 
                $scope.posts = $scope.posts.concat(toPush);

                $scope.posts.forEach(post => {
                    if (post.likes.indexOf($scope.userInSession._id) >= 0) {
                            post.liked = true;
                        } else {
                            post.liked = false;
                        }; 
                    }) 

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


    $scope.addPost = function (tweetText) {
        var tags = [],
            links = [],
            videos = [];
        if (tweetText) {
            var postText = $scope.filterLinks(tweetText, tags, videos, links);
        }

        $scope.newPost = {
            text: postText,
            _userId: $scope.userInSession._id,
            userName: $scope.userInSession.name,
            userUsername: $scope.userInSession.username,
            tags: tags,
            links: links,
            videos: videos,
            profilePicture: $scope.userInSession.profilePicture,
            photo: $scope.newPost.photo
        }


        if ($scope.newPost.photo) {
            let userToUpdate = userService.getUserInSession();
            userToUpdate.gallery.push($scope.newPost.photo);
            userService.updateUserFields({ user: userToUpdate })
                .catch(err => console.log(err));
        }


        if($scope.newPost.photo || tweetText){
            $scope.savePost($scope.newPost).then(res => {
                $scope.posts.unshift(res);   
            })
        }
       
       
    }

    $scope.likePost = (post) => {
        let alreadyLiked = post.likes.findIndex(id => {
            return id == $scope.userInSession._id;
        });
        if (alreadyLiked != -1) {
            post.likes.splice(alreadyLiked, 1);
            post.liked=false;
           
        } else {
            post.likes.push($scope.userInSession._id);
            post.liked=true;
        }
        PostsService.updatePost({ post: post }).then(p => {
            console.log(p.data);
            let alreadyLiked = $scope.userInSession.likes.findIndex(id => id === p.data._id);
            if (alreadyLiked != -1) {
                $scope.userInSession.likes.splice(alreadyLiked, 1);
            } else {
                $scope.userInSession.likes.push(p.data._id);
            }
            userService.updateUserFields({ user: $scope.userInSession }).then(u => {
                console.log(u);
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
        /*     $scope.tweetText = ''; */
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
        $scope.replies = $scope.post.replies;
    }


    $scope.deletePost = function (id, $index) {
        PostsService.removePost(id).then(postId => {        
            var postIndex = $scope.posts.findIndex(p => p._id === postId);
            var post = $scope.posts.splice($index, 1)[0];

            post.tags.forEach(tag => {
                TrendsService.getTagByName(tag).then(tag => {
                    var index = tag.posts.findIndex(id => id === postId)
                    if (index != -1) {
                        tag.posts.splice(index, 1);
                    }
                    if (tag.posts.length == 0) {
                        TrendsService.removeTagById(tag._id).then(t => console.log(t.data));
                    } else {
                        TrendsService.updateTag(tag).then(t => {
                            console.log(t);
                        });
                    }
                })
            })

            var index = $scope.userInSession.posts.findIndex(id => id === postId);
            if (index != -1) {
                $scope.userInSession.posts.splice(index, 1);
            }

            var like = $scope.userInSession.likes.findIndex(id => id === postId);
            if (like != -1) {
                $scope.userInSession.likes.splice(like, 1);
            }

            if(post.photo){
                var postPic = $scope.userInSession.gallery.findIndex(pic => pic === post.photo);
                if(postPic != -1) {
                    $scope.userInSession.gallery.splice(postPic, 1);
                } 
            }         
            
            console.log($scope.userInSession.gallery)

            userService.updateUserFields({user:$scope.userInSession}).then(u => {
                console.log(u);
                console.log('Succesfully removed');
            })
            .catch(err => console.log(err))


        })
    }

    $scope.savePost = function (post) {
        return new Promise(function (resolve, reject) {
            PostsService.savePost({ post: post }).then(post => {
                var post = post.data;
                if (post.tags.length > 0) {
                    for (var i = 0; i < post.tags.length; i++) {

                        let tag = {
                            title: post.tags[i],
                            posts: post._id
                        };
                        TrendsService.saveOrUpdateTag(tag).then(tag => { $scope.tags.push(tag) });
                        
                    }
                }

                userService.saveNewPost({ userId: $scope.userInSession._id, post: post._id })
                    .then(u => {
                        delete u.data.password;
                        $scope.userInSession = u.data;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    
                resolve(post);
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





