$(function () {
    //区域滑动
    mui('.mui-scroll-wrapper').scroll({
        indicators:false
    });
    // 1.页面初始化的时候，关键字在输入框内显示
    var urlParams = MT.getParamsByUrl();
    var $input = $('.mt_search_bar input').val(urlParams.key || '');

    // 2.页面初始化的时候，根据关键字查询第一页数据4条
    // 3.用户点击搜索的时候，根据新的关键字搜索商品，重置排序功能
    $('.mt_search_bar a').on('tap', function () {
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        getSearchData({
            proName: key,
            page: 1,
            pageSize: 4
        },function (data) {
            $('.mt_content ul').html(template('productList',data));
        })
    }).triggerHandler("tap");
    // 4.用户点击排序的时候，根据排序的选项去进行排序（默认的时候是降序，再次点击的时候升序）
    $(".mt_search_order a").on('tap', function () {
        $this = $(this);
        if ( $this.hasClass('now') ){
            if ( $this.find('span').hasClass('fa-angle-down') ) {
                $this.find('span').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else if ( $this.find('span').hasClass('fa-angle-up') ) {
                $this.find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        } else {
            $this.addClass('now').siblings().removeClass('now')
                .find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
        };
    //    获取当前点击功能的参数  price 1 2， num 1 2
        var order = $this.attr('data-order');
        var orderVal = $this.find('span').hasClass('fa-angle-up') ? 1 : 2;
        var key = $.trim($input.val());
        if (!key) {
            mui.toast('请输入关键字');
            return false;
        }
        var params = {
            proName: key,
            page: 1,
            pageSize: 4
        };
        params[order] = orderVal;
        getSearchData(params,function (data) {
            $('.mt_content ul').html(template('productList',data));
        });
    });
    // 5.用户下拉的时候 根据当前条件刷新 上拉加载重置  排序功能也重置
    mui.init({
        pullRefresh: {
            container:"#refreshContainer",
            //下拉
            down: {
                auto: true,
                contentdown : "下拉刷新",
                // contentover : "释放立即刷新",
                // contentrefresh : "正在刷新...",
                // style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
                // color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
                // height:'50px',//可选,默认50px.下拉刷新控件的高度,
                // range:'100px', //可选 默认100px,控件可下拉拖拽的范围
                // offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
                callback: function () {
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    $(".mt_search_order a").removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
                    var params = {
                        proName: key,
                        page: 1,
                        pageSize: 4
                    };
                    getSearchData(params,function (data) {
                        setTimeout(function () {
                            $('.mt_content ul').html(template('productList',data));
                            that.endPulldownToRefresh();
                            that.refresh(true);
                        },1000);
                    });
                }
            },
            //上拉
            up: {
                callback: function () {
                    window.page ++;
                    var that = this;
                    var key = $.trim($input.val());
                    if (!key) {
                        mui.toast('请输入关键字');
                        return false;
                    }
                    var order = $('.mt_search_order a.now').attr('data-order');
                    var orderVal = $('.mt_search_order a.now').find('span').hasClass('fa-angle-up') ? 1 : 2;
                    var params = {
                        proName: key,
                        page: window.page,
                        pageSize: 4
                    };
                    params[order] = orderVal;
                    getSearchData(params,function (data) {
                        setTimeout(function () {
                            $('.mt_content ul').append(template('productList',data));
                            //    注意：停止上拉加载
                            if (data.data.length){
                                that.endPullupToRefresh();
                            } else {
                                that.endPullupToRefresh(true);
                                // that.pullRefresh().endPulldown(true);
                            }
                        },1000);
                    })
                }
            }
        }
    });
    // 6.用户上拉的时候 加载下一页（没有数据就不去加载了)
});
var getSearchData = function (params, callback) {
    $.ajax({
        url: '/product/queryProduct',
        type: 'get',
        data: params,
        dataType: 'json',
        success: function (data) {
            window.page = data.page;
            callback && callback(data);
        }
    });
};
