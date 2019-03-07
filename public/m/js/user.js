$(function () {


   // 退出登录
   $('.logout').on('tap',function () {
       MT.loginAjax({
           url: '/user/logout',
           type: 'get',
           data: '',
           dataType: 'json',
           success: function (data) {
               if (data.success == true){
                   location.href = 'login.html';
               }
           }
       });
   });
});