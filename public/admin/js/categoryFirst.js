$(function () {
    /*1.分类列表分页展示*/
    var currentPage = 1;
    var render = function(){
        getCategoryFirstData({
            page: currentPage,
            pageSize: 10
        },function (data) {
            $('tbody').html(template('category',data));
            setPage(currentPage, Math.ceil(data.total/data.size), render)
        })
    }
    render();

    /*2.分页展示*/
    function setPage(pageCurrent, pageSum, callback) {
        $(".pagination").bootstrapPaginator({
            //设置版本号
            bootstrapMajorVersion: 3,
            // 显示第几页
            currentPage: pageCurrent,
            // 总页数
            totalPages: pageSum,
            //当单击操作按钮的时候, 执行该函数, 调用ajax渲染页面
            onPageClicked: function (event,originalEvent,type,page) {
                // 把当前点击的页码赋值给currentPage, 调用ajax,渲染页面
                currentPage = page
                callback && callback()
            }
        })
    }

    /*3.添加一级分类功能*/
    // 表单校验
    $('#form').bootstrapValidator({
        feedbackIcons: {/*input状态样式图片*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {/*验证：规则*/
            categoryName: {
                validators: {
                    notEmpty: {//非空验证：提示消息
                        message: '一级分类名称不能为空'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {//点击提交之后
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);
        // Use Ajax to submit form data 提交至form标签中的action，result自定义
        $.ajax({
            url: '/category/addTopCategory',
            type: 'post',
            data: $form.serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.success = true) {
                    $('#myModal').modal('hide');
                    currentPage = 1;
                    render();
                    $form.data('bootstrapValidator').resetForm();
                    $form.find('input').val('');
                }
            }
        })
    });

});
/*获取数据*/
var getCategoryFirstData = function (params,callback) {
  $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      data: params,
      dataType: 'json',
      success: function (data) {
          callback && callback(data);
      }
  })
};
