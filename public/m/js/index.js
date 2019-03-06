$(function () {
    //    滑动
    mui('.mui-scroll-wrapper').scroll({
        indicators: false,
        deceleration:0.005
    });

//    轮播图
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval:1000
    });

    // 商品渲染
    getIndexData({
        page: 1,
        pageSize: 6
    },function (data) {
        console.log(data);
        $('.mt_content ul').html(template('index_content',data));
    })
    // 下拉刷新
    mui.init({
        pullRefresh: {
            container:"#refreshContainer",
            //上拉
            up: {
                callback: function () {
                    window.page ++;
                    var that = this;
                    var params = {
                        page: window.page,
                        pageSize: 6
                    };
                    getIndexData(params,function (data) {
                        setTimeout(function () {
                            $('.mt_content ul').append(template('index_content',data));
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
});
var getIndexData = function (params, callback) {
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