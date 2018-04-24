// LOGIN CHECK WITH BACKEND - TESTING

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

// ANIMATION

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
