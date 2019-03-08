$(function () {
    /*1.分类列表分页展示*/
    var currentPage = 1;
    var render = function(){
        getSecondCategoryData({
            page: currentPage,
            pageSize: 5
        },function (data) {
            $('tbody').html(template('secondCategory',data));
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
    initDropDown();
    initUpload();
    // 3.添加二级分类
    // 3.1下拉选择一级分类
    $('#defaultForm').bootstrapValidator({
        /*校验插件默认会忽略隐藏的表单元素*/
        /*不忽略任何情况的表单元素*/
        excluded: [],
        feedbackIcons: {/*input状态样式图片*/
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {/*验证：规则*/
            categoryId: {//验证input项：验证规则
                validators: {
                    notEmpty: {
                        message: '请选择一级分类'
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: '二级分类名称不能为空'
                    }
                }
            },
            brandLogo:{
                validators: {
                    notEmpty: {
                        message: '请上传二级分类Logo'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {//点击提交之后
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);
        console.log($form.serialize());
        // Use Ajax to submit form data 提交至form标签中的action，result自定义
        $.ajax({
            url: '/category/addSecondCategory',
            type: 'post',
            data: $form.serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    currentPage = 1;
                    render();
                    $form[0].reset();
                    $form.data('bootstrapValidator').resetForm();
                    $('.dropdown-text').html('请选择');
                    $form.find('img').attr('src','images/none.png');
                }
            }
        })
    });

    // 3.2上传图片
    // 3.3校验表单
});
//获取数据
var getSecondCategoryData = function (params,callback) {
  $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      data: params,
      dataType: 'json',
      success: function (data) {
          callback && callback(data);
      }
  })
};
/*获取数据*/
var getCategoryFirstData = function (callback) {
    $.ajax({
        url: '/category/queryTopCategoryPaging',
        type: 'get',
        data: {
            page: 1,
            pageSize: 100
        },
        dataType: 'json',
        success: function (data) {
            callback && callback(data);
        }
    })
};
//下拉选择
var initDropDown = function () {
    var $dropDown = $('.dropdown-menu');
    getCategoryFirstData(function (data) {
        $('#firstCategoryMenu').html(template('firstCategory',data));
    })
    $dropDown.on('click','a',function () {
        $('.dropdown-text').html($(this).html());
        $('[name="categoryId"]').val($(this).data('id'));
        $('#defaultForm').data('bootstrapValidator').updateStatus('categoryId','VALID');
    })
}

//图片上传
var initUpload = function () {
    $('[name="pic1"]').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $(this).parent().parent().next().find('img').attr('src',data.result.picAddr);
            $('[name="brandLogo"]').val(data.result.picAddr);
            console.log($(this));
        }
    });
};
