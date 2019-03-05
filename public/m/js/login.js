$(function () {
   // 密码可见/不可见
   $('.mt_login .mt_login_input span') .on('tap',function () {
       if ($(this).hasClass('fa-eye')) {
           $(this).removeClass('fa-eye').addClass('fa-eye-slash');
           $(this).siblings().attr('type','password');
       } else if ($(this).hasClass('fa-eye-slash')) {
           $(this).removeClass('fa-eye-slash').addClass('fa-eye');
           $(this).siblings().attr('type','text');
       }
   });
   $('.login').on('tap',function () {
       // 获取用户名和密码
       var username = $('#username').val();
       var password = $('#password').val();
       // 登录验证


       var params = {
           username: username,
           password: password
       };

       $.ajax({
           url: '/user/login',
           type: 'post',
           data: params,
           dataType: 'json',
           success: function (data) {
               if (data.success == true){
                   var returnUrl = location.search.replace('?returnUrl=','');
                   if (!returnUrl) {
                       location.href = MT.userUrl;
                   } else {
                       location.href = returnUrl;
                   }
               } else {
               //    业务不成功
                   mui.toast(data.message);
               }

           }
       })
   })
});