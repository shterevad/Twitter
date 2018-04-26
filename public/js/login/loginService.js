$(function () {
    $('#login-page-login-submit').on('click', function (event) {
        var user = {
            name: "pesho",
            password: "1234567"
        }

        $.post('/login/login', user).then(function (data) {
            console.log(data.message);
        }).catch(function (data) {
            console.log(data);
            console.log(data.responseJSON.error);
        });
    });
});