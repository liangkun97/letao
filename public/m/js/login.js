$(function () {
   // $('.login').on('tap',function () {
   //     // 获取用户名和密码
   //     var username = $('#username').val();
   //     var password = $('#password').val();
   //     // 登录验证

       // serialize() 方法通过序列化表单值创建url编码文本字符串
       // 都是通过input表单的name属性取值  name=value，input必须有name属性，否则无法获取
       //  serializeArray() 方法通过序列化表单值来创建对象（name：value）的数组
    $('.login').on('tap',function () {
        var data = $('form').serialize();
        var dataObj = MT.serializeObject(data);

        if (!dataObj.username){
            mui.toast('请输入用户名');
            return false;
        };
        if (!dataObj.password){
            mui.toast('请输入密码');
            return false;
        };
        $.ajax({
            url: '/user/login',
            type: 'post',
            data: dataObj,
            dataType: 'json',
            success: function (data) {
                if (data.success == true){
                    var returnUrl = location.search.replace('?returnUrl=','');
                    if (returnUrl) {
                        location.href = returnUrl;
                    } else {
                        location.href = MT.userUrl;
                    }
                } else {
                    //    业务不成功
                    mui.toast(data.message);
                }
            }
        });
    });
});