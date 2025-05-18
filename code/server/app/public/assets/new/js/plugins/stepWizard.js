var StepWizard = function () {

    return {

        initStepWizard: function () {
            var form = $(".shopping-cart");
                form.validate({
                    errorPlacement: function errorPlacement(error, element) { element.before(error); },
                    rules: {
                        confirm: {
                            equalTo: "#password"
                        }
                    }
                });
                form.children("div").steps({
                    headerTag: ".header-tags",
                    bodyTag: "section",
                    transitionEffect: "fade",
                    onStepChanging: function (event, currentIndex, newIndex) {
                        // return new Promise(function (resolve, reject) { 
                    
                            if (currentIndex > newIndex)
                            {
                                // resolve(true);
                                return true;
                            }
                            form.validate().settings.ignore = ":disabled,:hidden";
                            const isValid = form.valid();
                            // if (!isValid) return false;
                            if (newIndex ==1 ) {
                                setTimeout(function () {
                                    $('#addr-name').val(localStorage.getItem('addr-name') || '')
                                    $('#addr-phone').val(localStorage.getItem('addr-phone') || '')
                                    $('#addr-address').val(localStorage.getItem('addr-address') || '')
                                    $('#addr-city').val(localStorage.getItem('addr-city') || '')
                                    $('#addr-zip').val(localStorage.getItem('addr-zip') || '')
                                }, 500)
                            }
                            if (currentIndex == 1) {
                                if (!isValid) {
                                    // resolve(false)
                                    return false
                                }
                                Ap.request.post("/shop/order",{
                                    billAmount: parseFloat($('#cart-total-price').val()),
                                    addrName: $('#addr-name').val(),
                                    addrPhone: $('#addr-phone').val(),
                                    addrCity: $('#addr-city').val(),
                                    addrZip: $('#addr-zip').val(),
                                    addrAddress: $('#addr-address').val(),
                                },function (res) {
                                    if (res.success) {
                                        localStorage.setItem("addr-name", $('#addr-name').val())
                                        localStorage.setItem("addr-phone", $('#addr-phone').val())
                                        localStorage.setItem("addr-address", $('#addr-address').val())
                                        localStorage.setItem("addr-city", $('#addr-city').val())
                                        localStorage.setItem("addr-zip", $('#addr-zip').val())
                                        setTimeout(function () {
                                            $('.order-num').text(res.result)
                                        }, 300)
                                        // resolve(true)
                                    }
                                })
                                return isValid
                            } else {
                                // resolve(isValid)
                                return isValid
                            }
                        // });
                    },
                    onFinishing: function (event, currentIndex) {
                        form.validate().settings.ignore = ":disabled";
                        return form.valid();
                    },
                    onFinished: function (event, currentIndex) {
                        alert("Submitted!");
                    }
                });
        }, 

    };
}();        