mainApp.service('PostsService', function ($q,$http) {
    this.getPosts = () => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/posts').then(function (response) {
            deferred.resolve(response.data);
        });
        
        return deferred.promise;
    }

    this.removePost = (id) =>$http.delete('http://localhost:3000/posts' + id);

    this.savePost = (post) =>$http.post('http://localhost:3000/posts', post);


});