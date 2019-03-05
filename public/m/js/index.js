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
});