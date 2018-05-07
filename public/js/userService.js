mainApp.service('userService', function ($http, $q, $timeout) {
    const NAME_MIN_LENGTH = 2;
    const NAME_MAX_LENGTH = 20;
    const PASSWORD_MIN_LENGTH = 6;
    const OK_STATUS = 200;
    const INVALID_DATA_STATUS = 400;
    const INVALID_CREDENTIALS_STATUS = 401;
    const USER_EXISTS_STATUS = 403;
    const DOESNT_EXIST_STATUS = 404;

    //firebase setup
    let config = {
        apiKey: "AIzaSyDjF-wLRhxCVm2CKOG89G05-AzrYS6Ztog",
        authDomain: "twitter-project-6abd2.firebaseapp.com",
        databaseURL: "https://twitter-project-6abd2.firebaseio.com",
        projectId: "twitter-project-6abd2",
        storageBucket: "gs://twitter-project-6abd2.appspot.com",
        messagingSenderId: "827549512821"
    };

    firebase.initializeApp(config);
    let storage = firebase.app().storage();
    let storageRef = firebase.storage().ref();

    let uid;
    firebase.auth().signInAnonymously()
        .catch(err => console.log(err));

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var isAnonymous = user.isAnonymous;
            var uid = user.uid
            // storageRef = firebase.storage().ref(user.uid);
        }
    })

    //validations
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
                    delete response.data.user.password
                    sessionStorage.setItem("loggedUser", JSON.stringify(response.data.user));
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
        if (userId.length > NAME_MAX_LENGTH) {
            let toSend = "/users/id/" + userId;
            $http.get(toSend, userId)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        delete response.data.user.password;
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
    this.getUserByUsername = function (username) {
        let deferred = $q.defer();
        if (username.length <= 20) {
            let toSend = "/users/username/" + username;
            $http.get(toSend, username)
                .then(function (response) {
                    if (response.status === OK_STATUS) {
                        delete response.data.user.password;
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

    //get user in session storage
    this.getUserInSession = () => {
        let userToReturn = JSON.parse(sessionStorage.getItem("loggedUser"));

        if (userToReturn) {
            return userToReturn;
        } else {
            window.location.href = "/login";
        }
    }

    //update user in session storage
    this.updateUserInSession = (user) => {
        sessionStorage.setItem("loggedUser", JSON.stringify(user))
    }

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
    this.getUserInCookieSession = function () {
        let self = this;
        let deferred = $q.defer();
        let userId;

        this.checkUserInSession().then(function (res) {
            self.getUserById(res).then(function (response) {
                delete response.password;
                deferred.resolve(response);
            }).catch(function (error) {
                deferred.reject(error);
            })
        })
            .catch(function (err) {
                deferred.reject(err)
            });

        return deferred.promise;
    }

    //follow user
    this.followUser = function (userToFollowId) {
        let deferred = $q.defer();
        let userInSession = this.getUserInSession();
        let self = this;

        $http.post("/users/follow", { followerId: userInSession._id, toFollowId: userToFollowId })
            .then(function (res) {
                userInSession.following.push(userToFollowId);
                self.updateUserInSession(userInSession);
                deferred.resolve(res)
            })
            .catch(function (err) {
                deferred.reject(err.status)
            })

        return deferred.promise;
    }

    // unfollow user by id
    this.unfollowUser = function (userToUnfollowId) {
        let deferred = $q.defer();
        let userInSession = this.getUserInSession();
        let self = this;
        $http.post("/users/unfollow", { followerId: userInSession._id, toUnfollowId: userToUnfollowId })
            .then(function (res) {
                userInSession.following.splice(userInSession.following.indexOf(userToUnfollowId), 1);
                self.updateUserInSession(userInSession);
                deferred.resolve(res.status)
            })
            .catch(function (err) {
                deferred.reject(err.status)
            })
        return deferred.promise;
    }


    this.saveNewPost = (post) => $http.post('/users/post', post);

    this.updateUserFields = (user) => {
        let deferred = $q.defer();
        $http.post('/users/user', user)
            .then(response => {
                delete response.data.password
                sessionStorage.setItem("loggedUser", JSON.stringify(response.data));
                deferred.resolve(response.data);
            })
            .catch(error => deferred.reject(error));
        return deferred.promise
    };

    this.getRandomUsers = () => {
        var deferred = $q.defer();
        var promise = $http.get('/users/randomusers/').then(function (response) {
            deferred.resolve(response.data);
        });
        return deferred.promise;
    };


    this.getAllUsers = () => {
        var deferred = $q.defer();
        var promise = $http.get('/users/users').then(function (response) {
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
        let userInSessionId = this.getUserInSession()._id;
        if (idToCheck === userInSessionId) {
            return true
        } else {
            return false
        }
    }

    //upload picture
    this.uploadPicture = (data) => {
        let deferred = $q.defer();
        storageRef.child(data.name).put(data.file, data.metadata)
            .then(snapshot => {
                deferred.resolve(snapshot.downloadURL)
            })
            .catch(err => deferred.resolve(err));

        return deferred.promise;
    }

    this.deleteImage = (data) => {
        let deferred = $q.defer();
        let picToDeleteIndex = data.pic.slice(80).search(/.png|.jpg/);
        let picToDelete = data.pic.slice(80, (80 + 4 + picToDeleteIndex));
        console.log(picToDelete);
        storageRef.child(picToDelete).delete()
            .then(() => {
                $http.delete("/users/delete-image", data)
                    .then(response => {
                        console.log(response)
                        deferred.resolve(response)
                    })
                    .catch(error => {
                        console.log(error)
                        deferred.reject(error)
                    })
            })
            .catch(err => deferred.reject(err));


        
        return deferred.promise
    }


    //save changes to user settings
    this.changePass = (passData) => {
        let deferred = $q.defer();
        if (passData.new != passData.newRepeat) {
            deferred.reject({
                status: INVALID_DATA_STATUS,
                message: "The new password doesn't match. Please double check."
            })
        }

        if (!this.validatePassword(passData.new)) {
            deferred.reject({
                status: INVALID_CREDENTIALS_STATUS,
                message: "New password is not valid. Please keep in mind that your password must be at least 6 characters and must contain at least one number and one capital letter!"
            })
        }

        if ((passData.new === passData.newRepeat) && this.validatePassword(passData.new)) {
            $http.put("/users/pass-change", passData)
                .then(response => {
                    deferred.resolve({
                        status : response.status,
                        message : "Your password has been updated successfully"
                    });
                })
                .catch(err => {
                    deferred.reject({
                        message: "The password you've entered is not correct",
                        status : INVALID_CREDENTIALS_STATUS
                    });
                })
        }

        return deferred.promise
    }

});
