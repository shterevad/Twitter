// LOGIN CHECK WITH BACKEND - TESTING
mainApp.controller('LoginController', function ($scope, $http, $location, $window, userService) {
    const OK_STATUS = 200;
    const USER_EXISTS_STATUS = 403;
    const INVALID_CREDENTIALS_STATUS = 401;

    //SIGN UP FORM

    $scope.signUp = function($event){
        let newUser = {
            name: $scope.name,
            email: $scope.email,
            password: $scope.password
        }
        

        if(userService.validateUserWhenSignup(newUser)){
            userService.signUpNewUser(newUser).then(function(res){
                console.log(res)
                if(res === OK_STATUS){
                    var path = $location.absUrl();
                    $window.location.href = "/"
                } else {
                    console.log(res);
                }
            }).catch(function(err){
                console.log(err)
                var element = document.getElementById("error-message-box");
                element.classList.remove("hidden-error");
                element.innerHTML = "A user with this email address already exists!";
            })
        } else {
            var element = document.getElementById("error-message-box");
            element.classList.remove("hidden-error");
            element.innerHTML = "Invalid credentials. Please keep in mind that your password must be at least 6 symbols and it should contain a capital letter and a number!";
        }

    }

});

$(function () {
    $('#login-page-login-submit').on('click', function (event) {
        var user = {
            name: "pesho",
            password: "1234567"
        }

        $.post('/login/login', user).then(function (data) {
            console.log(data.message);
        }).catch(function (data) {  
            console.log(data.responseJSON.error);
        });
    });
});


// ANIMATION WITH JQUERY
$(function () {
    //clicking Sign up:
    $("#login-pg-sign-btn").on('click', function(event){
        event = event.originalEvent;
        event.preventDefault();
        $('body').css('overflow', 'hidden');
        $("#login-right-side-container").hide("slide", {direction: 'right'}, 'slow', function(){
            $("#login-right-side-container-signup-field").show("slide", {direction: 'right'}, 'slow'); 
        });
    });

    //clicking Log in:
    $("#login-pg-log-btn").on('click', function(event){
        event = event.originalEvent;
        event.preventDefault();
        $('body').css('overflow', 'hidden');
        $("#login-right-side-container").hide("slide", {direction: 'right'}, 'slow', function(){
            $("#login-right-side-container-login-field").show("slide", {direction: 'right'}, 'slow'); 
        });
    });

    //clicking Sign up from Log in form:
    $("#login-page-login-form-sign-btn").on('click', function(event){
        event = event.originalEvent;
        event.preventDefault();
        $('body').css('overflow', 'hidden');
        $("#login-right-side-container-login-field").hide("slide", {direction: 'right'}, 'slow', function(){
            $("#login-right-side-container-signup-field").show("slide", {direction: 'right'}, 'slow'); 
        });
    });
    
    $(".footer-link>a").on('click', function(event){
        event = event.originalEvent;
        event.preventDefault();

        location.replace("/");
    })
});
