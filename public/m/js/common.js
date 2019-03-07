//获取url传递过来的参数
window.MT = {};
MT.getParamsByUrl = function () {
    var params = {};
    var search = location.search;
    if (search) {
        search = search.replace('?', '');
        var arr = search.split('&');
        arr.forEach(function (item, i) {
           var itemArr = item.split('=');
           params[itemArr[0]] = itemArr[1];
        });
    }
    return params;
};
MT.getItemById = function (arr,id) {
  var obj = null;
  arr.forEach(function (item,i) {
      if (item.id == id){
          obj = item;
      }
  });
    return obj;
};
// 需要登录的ajax请求
MT.loginUrl = '/m/user/login.html';
MT.cartUrl = '/m/user/cart.html';
MT.userUrl = '/m/index.html';
MT.loginAjax = function (params) {
    $.ajax({
        url: params.url || '#',
        type: params.type || 'get',
        data: params.data || '',
        dataType: params.dataType || 'json',
        success: function (data) {
            if (data.error == 400) {
                location.href = MT.loginUrl + '?returnUrl=' + location.href;
                return false;
            }else{
                params.success && params.success(data);
            }
        },
        error: function () {
            mui.toast('服务器繁忙');
        }
    })
};
MT.serializeObject = function (serializeStr) {
  var obj = {};
  /*key=value&k=v*/
  if (serializeStr){
      var arr = serializeStr.split('&');
      arr.forEach(function (item,i) {
         var itemArr = item.split('=');
         obj[itemArr[0]] = itemArr[1];
      });
  }
  return obj;
};