// function subtractQty(){
//     if(document.getElementById("qty").value - 1 < 0)
//         return;
//     else
//         document.getElementById("qty").value--;
// }

function subtractQty() {
    // console.log("subtractQty1", arguments, window.event);
    var trParent = $(event.target).closest('tr')
    var qty = parseInt(trParent.find('.quantity-field').val())

    // console.log(trParent)
    if(qty - 1 < 1)
        return;
    else
        trParent.find('.quantity-field').val(qty-1);

    var price = parseFloat(trParent.find('.g-price').text())
    var qty = parseFloat(trParent.find('.quantity-field').val())
    trParent.find('.shop-red').text(price * qty + '元')

    calcTotal()
}

function plusQty() {
    var trParent = $(event.target).closest('tr')
    var qty = parseInt(trParent.find('.quantity-field').val())

        trParent.find('.quantity-field').val(qty+1);

    var price = parseFloat(trParent.find('.g-price').text())
    var qty = parseFloat(trParent.find('.quantity-field').val())

    trParent.find('.shop-red').text(price * qty + '元')

    calcTotal()
}

function calcTotal() { 
    var allTotal = 0
    $('.cart-item .shop-red').each(function(index, element) {
        var trTotal= $(this)
        var total = parseFloat(trTotal.text())
        allTotal += total
    })
    $('#cart-total-price').text(allTotal + '元')
}