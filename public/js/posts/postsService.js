mainApp.service('PostsService', function ($q, $http, userService, TrendsService) {

    this.getPosts = () => {
        var deferred = $q.defer();
        var promise = $http.get('http://localhost:3000/posts/posts').then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }

    this.getPosts = () => $http.get('http://localhost:3000/posts/posts');

    this.removePost = (id) => $http.delete('http://localhost:3000/posts/posts/' + id);

    this.savePost = (post) => $http.post('http://localhost:3000/posts/newpost', post);

    this.updatePost = (post) => $http.post('http://localhost:3000/posts/post/update', post);

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

    this.sortByDateDesc = function (data) {
        return data.sort((d1, d2) => {
            return new Date(d1.posted) - new Date(d2.posted);
        })
    }

    this.sortByDateEsc = function (data) {
        return data.sort((d1, d2) => {
            return new Date(d2.posted) - new Date(d1.posted);
        })
    }

    this.getDate = function (date) {
        var date = new Date(date);
        var hour = date.getHours(),
            minute = date.getMinutes(),
            second = date.getSeconds(),
            hourFormatted = hour % 12 || 12,
            minuteFormatted = minute < 10 ? "0" + minute : minute,
            morning = hour < 12 ? "AM" : "PM";
        return hourFormatted + ":" +
            minuteFormatted + morning + " - " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
    }


});
