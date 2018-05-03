mainApp.service('PostsService', function ($q, $http, userService) {

    this.getPosts = () => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/posts/posts').then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }

    this.removePost = (id) => $http.delete('http://localhost:3000/posts/posts' + id);

    this.savePost = (post) => $http.post('http://localhost:3000/posts/newpost', post);


    //get all users post
    this.getPostsByUserId = (userId) => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/posts/posts/' + userId).then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }

    this.getPostById = (id) => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/posts/' + id).then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }

});

function sortByDateDesc(data) {
    data.sort((d1, d2) => {
        if (d1.posted > d2.posted)
            return -1;
        if (d1.posted < d2.posted)
            return 1;
        return 0;
    })
}

