mainApp.controller('LoginController', function ($scope, $http, $location, $window, $route, userService) {
    const OK_STATUS = 200;
    const USER_DOESNT_EXIST_STATUS = 404;
    const USER_EXISTS_STATUS = 403;
    const INVALID_CREDENTIALS_STATUS = 401;
    sessionStorage.removeItem("loggedUser");

    //SIGN UP FORM
    $scope.signUp = function (e) {
        e.preventDefault();
        let newUser = {
            name: $scope.name,
            email: $scope.email,
            password: $scope.password,
            username: $scope.username
        }

        if (userService.validateUserWhenSignup(newUser)) {
            userService.signUpNewUser(newUser).then(function (res) {
                if (res === OK_STATUS) {
                    $window.location.reload();
                } else {
                    console.log(res);
                }
            }).catch(function (err) {
                var element = document.getElementById("error-message-box-signup");
                element.classList.remove("hidden-error");
                element.innerHTML = "A user with this email address or username already exists!";
            })
        } else {
            var element = document.getElementById("error-message-box-signup");
            element.classList.remove("hidden-error");
            element.innerHTML = "Invalid credentials. Please keep in mind that your password must be at least 6 symbols and it should contain a capital letter and a number!";
        }

    }

    // LOGIN FORM
    $scope.login = function (e) {
        e.preventDefault();

        let checkUser = {
            name: $scope.user,
            password: $scope.password,
        }

        userService.loginUser(checkUser).then(function (res) {
            if (res === OK_STATUS) {
                $window.location.href = "/";
            }
        }).catch(function (err) {
            var element = document.getElementById("error-message-box-login");
            element.classList.remove("hidden-error");
            if (err.status == USER_DOESNT_EXIST_STATUS) {
                element.innerHTML = "This user doesn't exists";
            };

            if (err.status == INVALID_CREDENTIALS_STATUS) {
                element.innerHTML = "Invalid credentials. Please check again!";
            }
        })
    }
});



// ANIMATION WITH JQUERY
$(function () {
    //clicking Sign up:
    $("#login-pg-sign-btn").on('click', function (event) {
        event = event.originalEvent;
        event.preventDefault();
        $('body').css('overflow', 'hidden');
        $("#login-right-side-container").hide("slide", { direction: 'right' }, 'slow', function () {
            $("#login-right-side-container-signup-field").show("slide", { direction: 'right' }, 'slow');
        });
    });

    //clicking Log in:
    $("#login-pg-log-btn").on('click', function (event) {
        event = event.originalEvent;
        event.preventDefault();
        $('body').css('overflow', 'hidden');
        $("#login-right-side-container").hide("slide", { direction: 'right' }, 'slow', function () {
            $("#login-right-side-container-login-field").show("slide", { direction: 'right' }, 'slow');
        });
    });

    //clicking Sign up from Log in form:
    $("#login-page-login-form-sign-btn").on('click', function (event) {
        event = event.originalEvent;
        event.preventDefault();
        $('body').css('overflow', 'hidden');
        $("#login-right-side-container-login-field").hide("slide", { direction: 'right' }, 'slow', function () {
            $("#login-right-side-container-signup-field").show("slide", { direction: 'right' }, 'slow');
        });
    });

    $(".footer-link>a").on('click', function (event) {
        event = event.originalEvent;
        event.preventDefault();

        location.replace("/");
    })
});
