mainApp.service('userService', function ($http, $q, $timeout) {
    const NAME_MIN_LENGTH = 2;
    const NAME_MAX_LENGTH = 15;
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

    this.validateUserWhenSignup = function (user) {
        return (this.validateEmail(user.email)) && (this.validateName(user.name)) && (this.validatePassword(user.password));
    }

    this.signUpNewUser = function (user) {
        var deferred = $q.defer();
            $http.post('/login/signup', user)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        resolve(response.status);
                    } else {
                        deferred.reject(response.status);
                    }
                })
                .catch(function (err) {
                    deferred.reject(err);
                });
        return deferred.promise;
    }

    this.loginUser = function (user) {
        var deferred = $q.defer();
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

    this.getUserById = function (userId) {
        var deferred = $q.defer();
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

    this.checkUserInSession = function () {
        var deferred = $q.defer();
        $http.get("/users/session").then(function (res) {
            deferred.resolve(res.data.user);
        })
            .catch(function (err) {
                deferred.reject(err);
            });
        return deferred.promise;
    }

    this.getUserInSession = function () {
        let self = this;
        var deferred = $q.defer();
        var userId;

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


});
