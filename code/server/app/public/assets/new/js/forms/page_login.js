var Login = function () {

    return {
        
        //Masking
        initLogin: function () {
	        // Validation for login form
	        $("#sky-form1").validate({
	            // Rules for form validation
	            rules:
	            {
	                email:
	                {
	                    required: true,
	                    email: true
	                },
	                password:
	                {
	                    required: true,
	                    // minlength: 3,
	                    // maxlength: 20
	                }
	            },
	                                
	            // Messages for form validation
	            messages:
	            {
	                email:
	                {
	                    required: '請輸入郵箱',
	                    email: '請輸入郵箱'
	                },
	                password:
	                {
	                    required: '請輸入密碼'
	                }
	            },                  
	            
	            // Do not change code below
	            errorPlacement: function(error, element)
	            {
	                error.insertAfter(element.parent());
	            },

							submitHandler: function (form) {
									//Ap.loading.start();
									// console.log(121, form, arguments)
									// return
									// console.log(Ap)
									// return
									let encrypt = new JSEncrypt();
									encrypt.setPublicKey(public_key);
									let json = {username: $('#sky-form1 .k-username').val(), password: $('#sky-form1 .k-password').val(), rememberMe: $('#sky-form1 .k-remeber').val()};
									let data = JSON.stringify(json);
									let encrpted = encrypt.encrypt(data);
									Ap.request.post('/shop/login', {content: encrpted}, function (res) {
											//Ap.loading.end();
											if (res.success) {
													window.location = '/';
											} else {
													$('#label_error').html(res.msg);
											}
									});
							}
	        });
        }

    };

}();