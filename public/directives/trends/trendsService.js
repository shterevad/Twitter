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
        //тук ти го промеинх да праща заявка с /tag/ по средата, защото видях, че така съм го направила за id-то
        // на user-a и май имаше някаква причина да е по този начин. можеш да го махнеш и да пробваш, само не забравяй
        //и в рутера на тагс да го махнеш от гет заявката

        var promise = $http.get(`http://localhost:3000/tags/tag/`+ tagName).then(function (response) {
            deferred.resolve(response.data);
        }).catch(function(err){
            deferred.reject(err);
        })

        // ^^ тук сложих да хвана грешката, защото иначе в конзолата излизаше, че не е хваната и исках да видя
        // от къде идва грешката
        
        return deferred.promise;
    }

})