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