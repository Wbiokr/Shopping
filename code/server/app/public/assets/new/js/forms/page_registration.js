var Registration = function () {

    return {
        
        //Registration Form
        initRegistration: function () {
	        // Validation       
	        $("#sky-form4").validate({                   
	            // Rules for form validation
	            rules:
	            {
	                username:
	                {
	                    required: true,
											email: true
	                },
									nickname:
	                {
	                    required: true,
	                },
	                password:
	                {
	                    required: true,
	                },
	                passwordConfirm:
	                {
	                    required: true,
	                    equalTo: '#password'
	                },
	                code:
	                {
	                    required: true
	                },
									checkbox:
	                {
	                    required: true
	                }
	            },
	            
	            // Messages for form validation
	            messages:
	            {
	                username:
	                {
	                    required: '请输入邮箱',
	                    email: '请输入正确的邮箱地址'
	                },
									nickname:
	                {
	                    required: '请输入昵称'
	                },
	                password:
	                {
	                    required: '请输入密码'
	                },
	                passwordConfirm:
	                {
	                    required: '请再次输入密码',
	                    equalTo: '请输入相同的密码'
	                },
									code:
	                {
	                    required: '请输入验证码'
	                },
	                checkbox:
	                {
	                    required: '请勾选使用协议'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            },
							submitHandler: function(form)
							{
									Ap.loading.start();
									let encrypt = new JSEncrypt();
									encrypt.setPublicKey(public_key);
									let json={username: $('#sky-form4 .k-username').val(),password:$('#sky-form4 .k-password').val()};
									let data=JSON.stringify(json);
									let encrpted = encrypt.encrypt(data);
									console.log(json, data, encrpted, public_key, encrypt.decrypt(encrpted));
									
									Ap.request.post('/shop/signIn',{content:encrpted,nickname:$('#sky-form4 .k-nickname').val(),code:$('#sky-form4 .k-code').val()},function (res) {
											Ap.loading.end();
											if(res.success){
													Ap.msg.alert("注册成功,赶快去登录吧!",function () {
															window.location='/shop/login';
													})
											}else{
													Ap.msg.error(res.msg);
											}
									});
							}
	        });
        }

    };
}();