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
    // 侧滑的时候  点击编辑  弹出对话框（尺寸，数量）
    // 策划的时候   点击删除 弹出对话框  确认框

    // 点击复选框  计算总金额

    //$.swipeoutOpen(el,direction)//打开指定列的滑动菜单，
    // el:指定列的dom对象，direction：取值left|right，指定打开的是左侧或右侧滑动菜单


    //$.swipeoutClose(el);//关闭指定列的滑动菜单，el:指定列的dom对象
    //				setTimeout(function() {
    //					$.swipeoutOpen(document.getElementById("OA_task_1").querySelector('li:last-child'), 'left');
    //					setTimeout(function() {
    //						$.swipeoutClose(document.getElementById("OA_task_1").querySelector('li:last-child'));
    //					}, 1000);
    //				}, 1000);
    //第一个demo，拖拽后显示操作图标，点击操作图标删除元素；
    var btnArray = ['确认', '取消'];
    $('.mui-table-view').on('tap', '#edit', function(event) {
        var elem = this;
        var id = $(this).parent().attr('data-id');
        var item = MT.getItemById(window.cartData.data,id);
        var html = template('item_edit',item);
        mui.confirm(html.replace(/\n/g,''), '喵喵淘购', btnArray, function(e) {
            if (e.index == 0) {
                console.log(e);
            } else {
                setTimeout(function() {
                    // $.swipeoutClose(elem);
                }, 0);
            }
        });
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
            if (currNum == 0) {
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
    //第二个demo，向左拖拽后显示操作图标，释放后自动触发的业务逻辑
    $('.mui-table-view').on('tap', '#delete', function(event) {
        var $this = $(this);
        var id = $this.parent().attr('data-id');
        mui.confirm('确认删除该商品？', '喵喵淘购', btnArray, function(e) {
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
                        }
                    }
                })
            } else {
                setTimeout(function() {
                    // $.swipeoutClose(elem);
                    /*TODO*/
                }, 0);
            }
        });
    });

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
            console.log(window.cartData);
        }
    })
};