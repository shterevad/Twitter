mainApp.service('PostsService', function ($http) {
    this.getPosts = () => $http.get('http://localhost:3000/posts');

    this.removePost = (id) =>$http.delete('http://localhost:3000/posts' + id);

    this.savePost = (post) =>$http.post('http://localhost:3000/posts', post);


});