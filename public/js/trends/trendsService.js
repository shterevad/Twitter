mainApp.service('TrendsService', function ($q, $http) {
    this.getRandomTags = () => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/tags/randomtags').then(function (response) {
            console.log(response.data);
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };

    this.saveOrUpdateTag = (tag) => $http.post('http://localhost:3000/tags/tags', tag);

    this.getTagByName = (tagName) => {
        var deferred = $q.defer();
        var promise = $http.get(`http://localhost:3000/tags/tag/`+ tagName).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }

    this.getTagById = (id) => {
        var deferred = $q.defer();
        var promise = $http.get(`http://localhost:3000/tags/`+ id).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }

    this.removeTagById=(id)=>$http.delete(`http://localhost:3000/tags/tags/`+ id);

    this.updateTag = (tag) =>$http.post('http://localhost:3000/tags/update', tag);

})