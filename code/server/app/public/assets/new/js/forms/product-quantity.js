function subtractQty(goodsID) {
    // console.log("subtractQty1", goodsID, arguments, window.event);
    var trParent = $(event.target).closest('tr')
    var qty = parseInt(trParent.find('.quantity-field').val())

    // console.log(trParent)
    // console.log(12, qty)
    if(qty - 1 < 1)
        return;
    else
        trParent.find('.quantity-field').val(qty-1);

    var price = parseFloat(trParent.find('.g-price').text().replace('NTD$', ''))
    var qty = parseFloat(trParent.find('.quantity-field').val())
    trParent.find('.shop-red').text('NTD$' + price * qty)

    calcTotal();
    !!goodsID && addCart(goodsID, qty, price, false)
}

function plusQty(goodsID) {
    var trParent = $(event.target).closest('tr')
    var qty = parseInt(trParent.find('.quantity-field').val())

        trParent.find('.quantity-field').val(qty+1);

    var price = parseFloat(trParent.find('.g-price').text().replace('NTD$', ''))
    var qty = parseFloat(trParent.find('.quantity-field').val())

    trParent.find('.shop-red').text('NTD$' + price * qty)

    calcTotal()
    addCart(goodsID,qty,price,true)
}

function calcTotal() { 
    var allTotal = 0
    $('.cart-item .shop-red').each(function(index, element) {
        var trTotal= $(this)
        var total = parseFloat(trTotal.text().replace('NTD$', ''))
        allTotal += total
    })
    $('#cart-total-price').text('NTD$' + allTotal)
}