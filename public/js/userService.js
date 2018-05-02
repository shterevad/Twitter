mainApp.service('userService', function ($http, $q, $timeout) {
    const NAME_MIN_LENGTH = 2;
    const NAME_MAX_LENGTH = 20;
    const PASSWORD_MIN_LENGTH = 6;
    const OK_STATUS = 200;
    const INVALID_DATA_STATUS = 400;
    const INVALID_CREDENTIALS_STATUS = 401;
    const USER_EXISTS_STATUS = 403;
    const DOESNT_EXIST_STATUS = 404;

    this.validateEmail = function (email) {
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    this.validateName = function (name) {
        return ((name.trim().length >= NAME_MIN_LENGTH) && (name.trim().length <= NAME_MAX_LENGTH));
    }

    this.hasNumber = function (elem) {
        return /\d/.test(elem);
    }

    this.hasLetters = function (elem) {
        return /\w/.test(elem);
    }

    this.hasCapitalLetter = function (elem) {
        return /\w*[A-Z]/.test(elem);
    }

    this.validatePassword = function (password) {
        return ((password.trim().length >= PASSWORD_MIN_LENGTH) && (this.hasNumber(password))
            && (this.hasLetters(password)) && (this.hasCapitalLetter(password)));
    }

    //validate credentials when signing up
    this.validateUserWhenSignup = function (user) {
        return (this.validateEmail(user.email)) && (this.validateName(user.name)) 
        && (this.validateName(user.username)) && (this.validatePassword(user.password));
    }

    //sign up user
    this.signUpNewUser = function (user) {
        let deferred = $q.defer();
            $http.post('/login/signup', user)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        deferred.resolve(response.status);
                    } else {
                        deferred.reject(response.status);
                    }
                })
                .catch(function (err) {
                    deferred.reject(err);
                });

        return deferred.promise;
    }

    //login user
    this.loginUser = function (user) {
        let deferred = $q.defer();
            $http.post('/login/login', user)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        deferred.resolve(response.status);
                    } else {
                        deferred.reject(response.status);
                    }
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
        return deferred.promise;
    }

    //get user by id
    this.getUserById = function (userId) {
        let deferred = $q.defer();
        if (userId.length > 20) {
            let toSend = "/users/id/" + userId;
            $http.get(toSend, userId)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        deferred.resolve(response.data.user);
                    } else {
                        deferred.reject(response.data);
                    }
                })
                .catch(function (err) {
                    deferred.reject(err);
                })
        } else {
            deferred.reject(err = INVALID_DATA_STATUS);
        }
        return deferred.promise;
    }

    //get user by username
    // this.getUserById = function (userId) {
    //     let deferred = $q.defer();
    //     if (userId.length > 20) {
    //         let toSend = "/users/id/" + userId;
    //         $http.get(toSend, userId)
    //             .then(function (response) {
    //                 if (response.status === OK_STATUS) {
    //                     deferred.resolve(response.data.user);
    //                 } else {
    //                     deferred.reject(response.data);
    //                 }
    //             })
    //             .catch(function (err) {
    //                 deferred.reject(err);
    //             })
    //     } else {
    //         deferred.reject(err = INVALID_DATA_STATUS);
    //     }
    //     return deferred.promise;
    // }

    //get id of user in session if logged
    this.checkUserInSession = function () {
        let deferred = $q.defer();
        $http.get("/users/session").then(function (res) {
            deferred.resolve(res.data.user);
        })
            .catch(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    //get the user in session
    this.getUserInSession = function () {
        let self = this;
        let deferred = $q.defer();
        let userId;

        this.checkUserInSession().then(function (res) {
            self.getUserById(res).then(function(response){
                    deferred.resolve(response)
                }).catch(function(error){
                    deferred.reject(error);
                })
            })
            .catch(function (err) {
                deferred.reject(err)
            });

            return deferred.promise;
    }

    //follow user
    this.followUser = function(userToFollowId){
        let deferred = $q.defer();
        this.checkUserInSession().then(function(response){
                $http.post("/users/follow", {followerId : response, toFollowId : userToFollowId})
                    .then(function(res){
                        deferred.resolve(res.status)
                    })
                    .catch(function(err){
                        deferred.reject(err.status)
                    })
            })
            .catch(function(error){
                deferred.reject(error)
            })
        
        return deferred.promise;
    }

    this.saveNewPost = (post) =>$http.post('/users/post', post);

    this.updateUserFields = (user) =>$http.post('/users/user', user);

    this.getRandomUsers = () => {
        var deferred = $q.defer();
        var promise = $http.get('/users/randomusers').then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };

    this.getFollowing = (usersId) => {
        var deferred = $q.defer();
        var promise = $http.get('/users/following/' + usersId).then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    }; 

    //check if given user is the one in session
    this.checkIfUserIsInSession = (idToCheck) => {
        var deferred = $q.defer();

        this.checkUserInSession().then(function(response){
            if(response === idToCheck){
                deferred.resolve(true);
            } else {
                deferred.reject(false);
            }

        })
        .catch(function(error){
            deferred.reject(false);
        })
     
        return deferred.promise;
    }

});
