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
	                    required: '請輸入郵箱',
	                    email: '請輸入正確的郵箱地址'
	                },
									nickname:
	                {
	                    required: '請輸入暱稱'
	                },
	                password:
	                {
	                    required: '請輸入密碼'
	                },
	                passwordConfirm:
	                {
	                    required: '請再次輸入密碼',
	                    equalTo: '請輸入相同的密碼'
	                },
									code:
	                {
	                    required: '請輸入驗證碼'
	                },
	                checkbox:
	                {
	                    required: '請勾選使用協議'
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
													Ap.msg.alert("註冊成功,趕快去登錄吧!",function () {
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