$(function () {
   // 获取一级分类的数据
    getFirstCategoryData(function (data) {
        $('.mt_category_left ul').html(template("firstTemplate",data));
        // 获取二级分类的数
        var categoryId = $('.mt_category_left ul li:first-child').find('a').attr("data-id");
        render(categoryId);
    });
    //点击一级分类加载对应的二级分类
    $('.mt_category_left').on('tap','a',function (e) {
        if ($(this).parent().hasClass('now')) return false;
        $('.mt_category_left li').removeClass("now");
        $(this).parent().addClass("now");
        render($(this).attr('data-id'));
    })
});
// 获取一级分类的数据
var getFirstCategoryData = function (callback) {
    $.ajax({
        url: '/category/queryTopCategory',
        type: 'get',
        data: '',
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
var getSecondCategoryData = function (params,callback) {
    $.ajax({
        url: "/category/querySecondCategory",
        type: "get",
        data: params,
        dataType: "json",
        success: function (data) {
            callback && callback(data);
        }
    })
};
//渲染
var render = function (categoryId) {
    getSecondCategoryData({
        id:categoryId
    },function (data) {
        $(".mt_category_right ul").html(template("secondTemplate",data));
    });
};