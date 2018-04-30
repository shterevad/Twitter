mainApp.service('userService', function ($http, $timeout) {
    const NAME_MIN_LENGTH = 2;
    const NAME_MAX_LENGTH = 15;
    const PASSWORD_MIN_LENGTH = 6;
    const OK_STATUS = 200;
    const USER_EXISTS_STATUS = 403;
    const INVALID_CREDENTIALS_STATUS = 401;
    const INVALID_DATA_STATUS = 400;

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
        return new Promise(function (resolve, reject) {
            $http.post('/login/signup', user)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        resolve(response.status);
                    } else {
                        reject(response.status);
                    }
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    this.loginUser = function (user) {
        return new Promise(function (resolve, reject) {
            $http.post('/login/login', user)
                .then(function (response) {
                    console.log(response);
                    if (response.status === OK_STATUS) {
                        resolve(response.status);
                    } else {
                        reject(response.status);
                    }
                })
                .catch(function (err) {
                    reject(err);
                })
        })
    }

    this.getUserById = function (userId) {
        return new Promise(function (resolve, reject) {
            if (userId.length > 20) {
                let toSend = "/users/" + userId;
                $http.get(toSend, userId)
                    .then(function (response) {
                        if (response.status === OK_STATUS) {
                            resolve(response.data.user);
                        } else {
                            reject(response.data);
                        }
                    })
                    .catch(function (err) {
                        reject(err);
                    })
            } else {
                reject(err = INVALID_DATA_STATUS);
            }
        })
    }



});
