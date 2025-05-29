window.collectGoods = [];
window.cartCount=0;
window.cartList=0;
window.goodsClass=[];

jQuery(document).ready(function() {
  getWishList()
  $(document).on('click', '.del-cart-btn', function () {
    delCart($(this).data('id'))
  })
  cartInfo()
  onAllCates()
})

function onAllCates() {
    Ap.request.get("/shop/goodsClass",{},function (res) {
        window.goodsClass=res.result;
        console.log(23, window.goodsClass)
        window.goodsClassCb && window.goodsClassCb(res.result) 
    })
}

function checkout() {
    if(cartCount<=0)
        Ap.msg.warning("購物車還是空的")
    else{
      window.location="/shop/cart";
    }
}
function cartInfo() {
    Ap.request.get("/shop/cartList",{},function (res) {
        window.cartList=res.result.cart
        window.cartCount = cartList.reduce(function (a, b) { return a + b.num }, 0);
        updateCartDom()
    })
}
function updateCartDom() {
  if (!document.getElementById('cart-container')) return
  var html = '';
  cartList.forEach(function (goods) {
    html += '<li>'
    html += '<a href="/shop/goods/'+goods.goodsID +'" target="_blank">'
    html += '<img src="'+goods.imgurl +'" alt="'+goods.name +'" class="" />'
    html += '</a>'
    html += '<button type="button" class="del-cart-btn close" data-id='+ goods.id +'>×</button>'
    html += '<div class="overflow-h">'
    html += '<span>' + goods.name + '</span>'
    html += '<small>' + goods.num +' x NTD$' + goods.price +'</small>'
    html += '</div></li>'
  });
  $('#cart-container').html(html)
  $('#cart-count').text(cartCount)
}
function logout() {
    Ap.request.post("/shop/logout",{},function (res) {
        if(res.success){
            window.location="/";
        }
    })
}
function delCart(id) {
    Ap.request.del("/shop/cart/"+id,{},function (res) {
        if (res.success) {
            // $(".div_cart_"+id).slideUp('fast',function(){
            //     $(".div_cart_"+id).remove();
            //     setAccount();
            //     Ap.msg.success("已從購物車中刪除");
            //     cartInfo()
            // });
            Ap.msg.success("已從購物車中刪除");
            setAccount();
            cartInfo()
        }else{
            Ap.msg.error("刪除失敗");
        }
    });
}
function delWishList(id) {
    Ap.request.del("/shop/wishlist/"+id,{},function (res) {
        if (res.success) {
            Ap.msg.success("已刪除收藏");
            getWishList()
            $(".div_wishlist_"+id).remove();
        }else{
            Ap.msg.error("取消收藏失敗");
        }
    });
}
function addWishList(goodsID) {
    Ap.request.post("/shop/wishlist",{goodsID},function (res) {
        if (res.success && res.result && res.result[1]) {
            Ap.msg.success("已收藏");
            getWishList()
        }else{
            Ap.msg.error("收藏失敗");
        }
    });
}
function getWishList() {
    Ap.request.get("/shop/wishQuery",{},function (res) {
        collectGoods=res.result.rows
        window.wishQueryCb && window.wishQueryCb(res.result)
    })
}
function addCompare(goodsID) {
    Ap.msg.success("功能還在開發中，盡請期待！");
}
function addCart(goodsID,num,price,isForce, isDisMsg, cb) {
    Ap.request.post("/shop/cart",{goodsID,num,price,isForce: Boolean(isForce)},function (res) {
        if(res.success){
            !isDisMsg && Ap.msg.success("已加入購物車");
            cartInfo()
            cb && cb()
        }else{
            !isDisMsg && Ap.msg.error("加入購物車失敗");
        }
    });
}
function sum() {
    let account=new Number(0.00);
    let nums=0;
    $('#cart-list .price').each(function () {
        let price=new Number($(this).data('price'));
        account+=price;
        nums++;
    });
    return {nums,account:account.toFixed(2)};
}
function setAccount() {
    let {nums,account}=sum();
    $('.cart_xj').text('NTD$'+account);
    $('.cart_total').text('NTD$'+account);
    $('.cart_num').text(nums);
}
$(function() {
    setAccount();
});