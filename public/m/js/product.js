$(function () {
    // 获取数据
    var productId = MT.getParamsByUrl().productId;
    getProductData(productId, function (data) {
        $('.mui-scroll').html(template('productTemp',data));
        // 轮播图
        mui('.mui-slider').slider({
            interval:1000
        });
        //  区域滑动
        mui('.mui-scroll-wrapper').scroll({
            indicators: false,
            deceleration:0.005
        });
        // 尺寸选择
        var currSize = null;
        $('.btn_size').on('tap', function () {
            $(this).addClass('now').siblings().removeClass('now');
        });
        // 数量选择
        $('.mt_detail_num span').on('tap',function () {
           var $input = $('.mt_detail_num input');
           var currNum = $input.val();
           //   字符串转数字
           var maxNum = parseInt($input.attr('data-max'));
           if ($(this).hasClass('jian')) {
               if (currNum == 0){
                   return false;
               }
               currNum --;
           }  else if ($(this).hasClass('jia')) {
               if (currNum >= maxNum){
                   mui.toast('库存不足');
                   return false;
               }
               currNum ++;
           };
           $input.val(currNum);
        });
        // 加入购物车
        $('.mt_addCart').on('tap',function () {
            var $changeBtn = $('.btn_size.now');
            if (!$changeBtn.length){
                mui.toast('请选择尺码');
                return false;
            }
            var num = $('.mt_detail_num input').val();
            if (num <= 0){
                mui.toast('请您选择数量');
                return false;
            }
            MT.loginAjax({
                url: '/cart/addCart',
                type: 'post',
                data: {
                    productId: productId,
                    num: num,
                    size: $changeBtn.html()
                },
                success: function (data) {
                    if (data.success == true){
                        mui.confirm('添加成功，去购物车看看？', '温馨提示', ['是', '否'], function(e) {
                            if (e.index == 0) {
                                location.href = MT.cartUrl;
                            } else {
                                //TODO
                            }
                        })
                    }
                }
            })
        });
    })
});
var getProductData = function (productId, callback) {
    $.ajax({
        url: '/product/queryProductDetail',
        type: 'get',
        data: {
            id: productId
        },
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};