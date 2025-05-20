/*
 * Template Name: Unify - Responsive Bootstrap Template
 * Description: Business, Corporate, Portfolio, E-commerce and Blog Theme.
 * Version: 1.6
 * Author: @htmlstream
 * Website: http://htmlstream.com
*/

var App = function () {
    var loadingFilter = false
    var clearing = false
    function handleBootstrap() {
        /*Bootstrap Carousel*/
        jQuery('.carousel').carousel({
            interval: 15000,
            pause: 'hover'
        });

        /*Tooltips*/
        jQuery('.tooltips').tooltip();
        jQuery('.tooltips-show').tooltip('show');      
        jQuery('.tooltips-hide').tooltip('hide');       
        jQuery('.tooltips-toggle').tooltip('toggle');       
        jQuery('.tooltips-destroy').tooltip('destroy');       

        /*Popovers*/
        jQuery('.popovers').popover();
        jQuery('.popovers-show').popover('show');
        jQuery('.popovers-hide').popover('hide');
        jQuery('.popovers-toggle').popover('toggle');
        jQuery('.popovers-destroy').popover('destroy');
    }

    function handleSearchV1() {
        jQuery('.search-button').click(function () {
            jQuery('.search-open').slideDown();
        });

        jQuery('.search-close').click(function () {
            jQuery('.search-open').slideUp();
        });

        jQuery(window).scroll(function(){
          if(jQuery(this).scrollTop() > 1) jQuery('.search-open').fadeOut('fast');
        });

        $(document).on('click', '.filter-buy-btn', function() {
            if (clearing) return
            clearing = true
            var id = $(this).attr('data-id')
            var price = $(this).attr('data-price')
            Ap.request.get('/shop/cartClear', {}, function(res) {
                clearing = false
                console.log(32, res)
                if (res.success) {
                    addCart(id, 1, price, true, true, function() {
                        window.location.href = '/shop/cart'
                    })
                }
            })
        })

        $('#price-filter-input').on('input', function() {
            this.value = Math.abs(parseFloat(this.value)) || ""
        })
        $('#price-filter-input').on('keyup', function() {
            // console.log(window.event)
            if (window.event.key === 'Enter' && !loadingFilter) {
                loadingFilter = true
                Ap.request.get('/shop/goodsPrice', {
                        price: $('#price-filter-input').val(),
                }, function(res) {
                    loadingFilter = false
                    if (res.success) {
                        if (res.result.length === 0) {
                            Ap.msg.error('未找到當前價格的商品')
                            return
                        }
                        var html = ''
                        res.result.forEach(o => {
                            html += `
                                <section class="w-per-100 f-s-c o-h">
                                    <img src="${o.imgurl}" class="w-60 h-60 b-r-6 o-h" />
                                    <div class="f-1 h-60 f-column justify-b p-lr-20">
                                        <div class="w-per-100 white-1 o-h">
                                            <a href="/shop/goods/${o.goodsID}" target="__blank" class="f-s-14 white-1">${o.name}</a>
                                        </div>
                                        <div class="f-b-c w-per-100 b-eee b-no-lr b-s-dashed p-tb-5">
                                            <h3 class="f-s-c m-no f-s-14">原價：<span class="c-red f-w-600 t-d-t">￥${o.priceMarket}</span> &nbsp;&nbsp; 現價：<span class="c-sus f-w-600">￥${o.price}</span></h3>
                                            <a href="javascript:void(0)" data-id=${o.goodsID} data-price=${o.price} class="filter-buy-btn">立即購買</a>
                                        </div>
                                    </div>
                                </section>
                            `
                        })
                        html += `
                            <svg t="1747650184371" class="icon p-a-xr-yt top-20 right-5 o-hover-70 ease-400 c-p" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1657" width="20" height="20"><path d="M512 0C229.376 0 0 229.376 0 512s229.376 512 512 512 512-229.376 512-512S794.624 0 512 0z m234.496 679.424c18.432 18.432 18.432 48.64 0 67.072-18.432 18.432-48.64 18.432-67.072 0L512 579.072l-167.424 167.424c-18.432 18.432-48.64 18.432-67.072 0-18.432-18.432-18.432-48.64 0-67.072L444.928 512 277.504 344.576c-18.432-18.432-18.432-48.64 0-67.072 18.432-18.432 48.64-18.432 67.072 0L512 444.928l167.424-167.424c18.432-18.432 48.64-18.432 67.072 0 18.432 18.432 18.432 48.64 0 67.072L579.072 512l167.424 167.424z" fill="#f00"></path></svg>
                        `
                        $('.search-open .search-result').show()
                        $('.search-open .search-result').html(html)
                        document.querySelector('.search-open .search-result .icon').onclick = function() {
                            $('.search-open .search-result').hide()
                        }
                    } else {
                        Ap.msg.error(res.msg || '查詢失敗')
                    }
                })   
            }
        })
    }

    function handleToggle() {
        jQuery('.list-toggle').on('click', function() {
            jQuery(this).toggleClass('active');
        });

        /*
        jQuery('#serviceList').on('shown.bs.collapse'), function() {
            jQuery(".servicedrop").addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        }

        jQuery('#serviceList').on('hidden.bs.collapse'), function() {
            jQuery(".servicedrop").addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        }
        */
    }

    function handleBoxed() {
        jQuery('.boxed-layout-btn').click(function(){
            jQuery(this).addClass("active-switcher-btn");
            jQuery(".wide-layout-btn").removeClass("active-switcher-btn");
            jQuery("body").addClass("boxed-layout container");
        });
        jQuery('.wide-layout-btn').click(function(){
            jQuery(this).addClass("active-switcher-btn");
            jQuery(".boxed-layout-btn").removeClass("active-switcher-btn");
            jQuery("body").removeClass("boxed-layout container");
        });
    }

    function handleHeader() {
         jQuery(window).scroll(function() {
            if (jQuery(window).scrollTop()>100){
                jQuery(".header-fixed .header-static").addClass("header-fixed-shrink");
            }
            else {
                jQuery(".header-fixed .header-static").removeClass("header-fixed-shrink");
            }
        });
    }

    function handleMegaMenu() {
        $(document).on('click', '.mega-menu .dropdown-menu', function(e) {
            e.stopPropagation()
        })
    }

    function handleScrollBar() {
        jQuery(document).ready(function ($) {
            "use strict";
            jQuery('.contentHolder').perfectScrollbar();
        });
    }

    return {
        init: function () {
            handleBootstrap();
            handleSearchV1();
            handleToggle();
            handleBoxed();
            handleHeader();
            handleMegaMenu();
            handleScrollBar();
        },

        initCounter: function () {
            jQuery('.counter').counterUp({
                delay: 10,
                time: 1000
            });
        },

        initParallaxBg: function () {
            jQuery('.parallaxBg').parallax("50%", 0.2);
            jQuery('.parallaxBg1').parallax("50%", 0.4);
        },

        initMouseWheel: function () {
            jQuery('.slider-snap').noUiSlider({
                start: [ 120, 420 ],
                snap: true,
                connect: true,
                range: {
                    'min': 0,
                    '5%': 20,
                    '10%': 40,
                    '15%': 80,
                    '20%': 120,
                    '25%': 160,
                    '30%': 200,
                    '35%': 240,
                    '40%': 280,
                    '50%': 300,
                    '60%': 340,
                    '70%': 380,
                    '80%': 420,
                    '90%': 460,
                    'max': 500
                }
            });
            jQuery('.slider-snap').Link('lower').to(jQuery('.slider-snap-value-lower'));
            jQuery('.slider-snap').Link('upper').to(jQuery('.slider-snap-value-upper'));
        },
    };

}();