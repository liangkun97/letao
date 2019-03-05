$(function () {

    // 注册
    $('.register').on('tap',function () {
        // 获取注册信息
        var username = $('.username').val();
        var password = $('.password').val();
        var confirmPw = $('.confirm_pw').val();
        var mobile = $('.mobile').val();
        var vCode = $('.vCode').val();
        // 校验信息
        //*    TODO    */

        // 提交注册
        var params = {
            username: username,
            password: password,
            mobile: mobile,
            vCode: vCode
        };
        $.ajax({
            url: '/user/register',
            type: 'post',
            data: params,
            dataType: 'json',
            success: function (data) {
                console.log(data);
            }
        })

    })
});
