$(function () {


    /*区域滚动*/
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });
    // 初始化页面，自动下拉刷新
    mui.init({
        pullRefresh : {
            container:"#refreshContainer",
            down : {
               auto: true,
               callback: function () {
                    var that = this;
                    setTimeout(function () {
                        getCartData(function (data) {
                            $('.mt_cart .mui-table-view').html(template('cartContent',data));
                            that.endPulldownToRefresh();
                            // 点击刷新按钮刷新
                            $('.fa-refresh').off('click').on('tap', function () {
                                that.pulldownLoading();
                            })
                        })
                    },500)

               }
           }
       }
    });

    $('body').on('tap','.btn_size',function () {
        $(this).addClass('now').siblings().removeClass('now');
    });
    // 数量选择
    $('body').on('tap','.mt_detail_num span',function () {
        var $input = $('.mt_detail_num input');
        var currNum = $input.val();
        //   字符串转数字
        var maxNum = parseInt($input.attr('data-max'));
        if ($(this).hasClass('jian')) {
            if (currNum <= 1) {
                mui.toast('至少一件商品');
                return false;
            }
            currNum--;
        } else if ($(this).hasClass('jia')) {
            if (currNum >= maxNum) {
                mui.toast('库存不足');
                return false;
            }
            currNum++;
        };
        $input.val(currNum);
    });
    // 商品删除
    $('.mui-table-view').on('tap', '#delete', function(event) {
        var li = this.parentNode.parentNode;
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        mui.confirm('确认删除该商品？', '喵喵淘购', ['确认', '取消'], function(e) {
            if (e.index == 0) {
                MT.loginAjax({
                    url: '/cart/deleteCart',
                    type: 'get',
                    data: {
                        id: id
                    },
                    dataType: 'json',
                    success: function (data) {
                        if (data.success == true) {
                            $this.parent().parent().remove();
                            setAmount();
                        }
                    }
                })
            } else {
                mui.swipeoutClose(li);
            }
        });
    });
    // 商品编辑
    $('.mui-table-view').on('tap', '#edit', function(event) {
        var li = this.parentNode.parentNode;
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        var item = MT.getItemById(window.cartData.data,id);
        var html = template('item_edit',item);
        mui.confirm(html.replace(/\n/g,''), '喵喵淘购', ['确认', '取消'], function(e) {
            if (e.index == 0) {
                var updataNum = $('.mt_detail_num input').val();
                var updataSize = $('.btn_size.now').html();
                var params = {
                    id: id,
                    size: updataSize,
                    num: updataNum
                };
                updataCart(params,function (data) {
                    if (data.success == true){
                        // 窗口关闭
                        // 列表渲染
                        item.num = updataNum;
                        item.size = updataSize;
                        // 渲染页面
                        var $checkbox = $('[type=checkbox]:checked');
                        $('.mt_cart .mui-table-view').html(template('cartContent',window.cartData));
                        //  选中购物车选中的商品
                        $checkbox.forEach(function (item,i) {
                            var id = $(item).attr('data-id');
                           $("input[type=checkbox][data-id='"+id+"']").prop("checked",true);
                        });
                        setAmount($checkbox);
                    }
                })
            } else {
                mui.swipeoutClose(li);
            }
        });
    });
    $('.mui-table-view').on('change','[type=checkbox]',function () {
        var $checkbox = $('[type=checkbox]:checked');
        setAmount($checkbox);
    })
});
var getCartData = function (callback) {
    $.ajax({
        url: '/cart/queryCartPaging',
        type: 'get',
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: 'json',
        success: function (data) {
            window.cartData = data;
            callback && callback(data);
        }
    })
};
var updataCart = function (params,callback) {
  $.ajax({
      url: '/cart/updateCart',
      type: 'post',
      data: params,
      dataType: 'json',
      success: function (data) {
          window.data = data;
          callback && callback(data);
      },
      error: function () {
          mui.toast('服务器繁忙');
      }
  })
};
var setAmount = function (checkbox) {
    var amountSum = 0;
    checkbox.forEach(function (item,i) {
        var id = $(this).attr('data-id');
        var item = MT.getItemById(window.cartData.data,id);
        var price = item.price;
        var num = item.num;
        var amount = price * num;
        amountSum += amount;
    });
    amountSum = Math.floor(amountSum * 100)/100;
    $('#cartAmount').html(amountSum);
};