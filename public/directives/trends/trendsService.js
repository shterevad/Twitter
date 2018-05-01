mainApp.service('TrendsService', function ($q, $http, PostsService) {
    this.getRandomTags = () => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/tags/randomtags').then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };

    this.saveOrUpdateTag = (tag) => $http.post('http://localhost:3000/tags/tags', tag);

    this.getTagByName = (tagName) => {
        var deferred = $q.defer();
        var promise = $http.get(`http://localhost:3000/tags/tags`+tagName).then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }

})