$(function () {
    // 搜索--带搜索关键字跳转至searchList.html
    $('.mt_search_bar a').on('tap',function () {
        var searchValue = $.trim($('.mt_search_bar form').find('input').val());
        // 判断内容是否为空
        if(!searchValue){
            // mui 弹出对话框
            mui.toast('请输入关键字');
            return false;
        }
        //记录关键字
        $('.mt_search_history_content ul')
            .append($('<li><a href="#" class="mt_history_item">'+ searchValue +'</a><a href="#" class="mt_history_delete"><span class="fa fa-times"></span></a></li>'));
        location.href = "searchList.html?key="+searchValue;
    });

});