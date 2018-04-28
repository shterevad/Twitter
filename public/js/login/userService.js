loginApp.service('userService', function () {
    const NAME_MIN_LENGTH = 2;
    const NAME_MAX_LENGTH = 15;

    this.validateEmail = function(email) {
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return emailPattern.test(email);
    }

    this.validateName = function(name){
       return ((name.trim().length >= NAME_MIN_LENGTH) && (name.trim().length <= NAME_MAX_LENGTH));
    }

    this.hasNumber = function(elem){
        return /\d/.test(elem);
    }

    this.hasLetters = function(elem){
        return /\w/.test(elem);
    }

    this.hasCapitalLetter = function(elem){
        return /\w*[A-Z]/.test(elem);
    }

    this.validatePassword = function(password){
        return ((password.trim().length >= 6) && (this.hasNumber(password)) 
            && (this.hasLetters(password)) && (this.hasCapitalLetter(password)));
    }

    this.validateUserWhenSignup = function(user){
        return (this.validateEmail(user.email)) && (this.validateName(user.name)) && (this.validatePassword(user.password));
    }

    this.signUpNewUser = function(user){
        if(this.validateUserWhenSignup(user)){
            return new Promise(function (resolve, reject) {
                $http.get('jirafi.json')
                    .then(function (response) {
                        resolve(response.data);
                    })
                    .catch(err => reject(err));
            });
        } else {

        }
    }
});
