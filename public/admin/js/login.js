$(function(){
    /*前端校验功能  bootstrap validator*/
    /*1.完整的表单结构  form   input  submit 这些元素*/
    /*2.表单元素需要对应的名字 name="username" */
    /*3.初始化表单验证组件 插件*/
    /*4.配置组件功能*/
    /*5.配置具体的属性需要的校验规则*/
    $('#login').bootstrapValidator({
        // 表单框里右侧的icon
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                validators: {
                    notEmpty: {
                        message: '请输入用户名'
                    },
                    callback: {
                        message: '用户名不存在'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: '请输入密码'
                    },
                    stringLength: {  //长度限制
                        min: 6,
                        max: 18,
                        message: '用户名长度必须在6到18位之间'
                    },
                    callback: {
                        message: '密码不正确'
                    }
                }
            }
        }
    }).on('success.form.bv', function(e) {
        //点击提交之后
        //禁止默认提交事件 因为要使用ajax提交而不是默认的提交方式
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);
        /*发送登录请求*/
        $.ajax({
            url: '/employee/employeeLogin',
            type: 'post',
            data: $form.serialize(),
            dataType: 'json',
            success: function (data) {
                if (data.success == true){
                    // 登录成功
                    // 后台管理员 root 123456
                    location.href = 'index.html';
                }else{
                    //登录不成功
                    //恢复可提交的按钮
                    $form.data('bootstrapValidator').disableSubmitButtons(false);
                    if (data.error == 1000){
                        // 状态须大写 invalid > INVALID
                        /* NOT_VALIDATED, VALIDATING, INVALID or VALID */
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback')
                    } else if (data.error = 1001) {
                        $form.data('bootstrapValidator').updateStatus('username','INVALID','callback')
                    }
                        
                }
            }
        })
    });
    $('#resetBtn').on('click',function () {
        $('#login').data('bootstrapValidator').resetForm();
    })
});