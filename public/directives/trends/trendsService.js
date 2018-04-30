mainApp.service('TrendsService', function ($q, $http, PostsService) {

    this.saveOrUpdateTag = (tag) =>$http.post('http://localhost:3000/tags/tags', tag);


})