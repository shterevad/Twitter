mainApp.controller('postController', function ($scope, PostsService, TrendsService, userService) {
    // get following posts and user posts
    $scope.posts = [];
    $scope.tweetText = '';

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

    $scope.addPost = function (post) {
        var tags = [],
            links = [],
            videos = [];

        var postText = $scope.filterLinks(post, tags,videos,links); 
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

        $scope.post=$scope.savePost(newPost);
        console.log($scope.post);
       
    }

    $scope.likePost = (id) => {
        console.log($scope.posts);
        let user = userService.getUserInSession();
        PostsService.getPostById(id).then(post => {
            $scope.post = post;
            let alreadyLiked =  $scope.post.likes.findIndex(id => {
                return id == $scope.userInSession._id
            });
            if (alreadyLiked != -1) {
                $scope.post.likes.splice(alreadyLiked, 1);
            } else {
                $scope.post.likes.push($scope.userInSession._id);
            }
            console.log($scope.post);
            PostsService.updatePost({ post:  $scope.post }).then(p => {
                $scope.post=p.data;
                console.log($scope.post);
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
        $scope.posted = getDate(post.posted);
        console.log($scope.post);
    }

    $scope.retweet = function (post) {
        var newPost=post;
        delete newPost._id;
          var tags = [],
              links = [],
              videos = [];
          
  
          newPost.retweetText=$scope.filterLinks($scope.reply, tags, links, videos);
              
  
        
          newPost.videos=newPost.videos.concat(videos);
          newPost.tags=newPost.tags.concat(tags);
          newPost.links=newPost.links.concat(links);
          newPost.userId=$scope.userInSession._id;
          newPost.userName=$scope.userInSession.name;
          var post = $scope.savePost(newPost);
          console.log(post);
              
          $('#retweetModal').modal('hide');
          newPost='';
          $scope.reply='';
  
      }

    $scope.savePost=function(post){
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
         userService.saveNewPost({ userId: $scope.userInSession._id, post: post.post._id })
            .then(p => p)
            .catch(err => {
                console.log(err);
            });
        $scope.posts.unshift(post.post);
        $scope.tweetText='';
        
           
        }).catch(err => {
            //todo:validation
        });
    }

    $scope.filterLinks= function (post, tags, videos, links) {
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





