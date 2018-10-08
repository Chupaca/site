'use strict'

function nav_on_click() {
    $(".navLink").slideUp(1)
    $(".header.only_mobile").removeClass("active")
    $(".nav").slideDown(400)
    $("#nav-btn").addClass("change")
    $("#nav-btn").css("background", "#ffffff")
}

function closeNav(e) {
    if ($("#nav-btn").hasClass('change')) {
        $(".nav").slideUp(400)
        $("#nav-btn").removeClass("change")
        $("#nav-btn").css("background", "none")
    }
}

function changeSideStickerPosition(hidden) {
    if (hidden && !$("#closed_sticker_flag").hasClass("visib")) {
        $("#closed_sticker_flag").addClass("visib").animate({ "right": "8vh" }, 300)
        $("#side_sticker").animate({ "right": "-15vh" }, 300)
    } else if (!hidden && $("#closed_sticker_flag").hasClass("visib")) {
        $("#closed_sticker_flag").removeClass("visib").animate({ "right": "-18vh" }, 300)
        $("#side_sticker").animate({ "right": "1vh" }, 300)

    }
}

function carousel(myIndex) {
    $(".mySlides").each(function (i, item) {
        if ($(item).hasClass("active")) {
            $(item).animate({
                opacity: 0
            }, 1000)
        }
    });
    ++myIndex
    if (myIndex > $(".mySlides").length) { myIndex = 1 }
    $(".mySlides").eq(myIndex - 1).addClass("active")
    $(".mySlides").eq(myIndex - 1).animate({
        opacity: 1
    }, 1000, function () {
        $(".overlay_slides_wrap").animate({
            opacity: "0.7"
        }, 500)
    })

    setTimeout(function () { carousel_addons(true, myIndex) }, 3000);
}

function carousel_addons(slidein, myIndex) {
    if (slidein) {
        $(".door_img").animate({ opacity: 1, right: "15%" }, 1000)
        $(".door_info_container").animate({ opacity: 1, right: "40%" }, 1000)
        $(".slider_left_text").animate({ opacity: 1, left: "9%" }, 1000)
        setTimeout(function () { carousel_addons(false, myIndex) }, 3000);
    } else {
        $(".door_img").animate({ opacity: 0, right: "10%" }, 500)
        $(".door_info_container").animate({ opacity: 0, right: "25%" }, 500)
        $(".slider_left_text").animate({ opacity: 0, left: "-25%" }, 500)
        $(".overlay_slides_wrap").animate({ opacity: 0 }, 800)
        setTimeout(function () { carousel(myIndex) }, 1000);
    }
}

function carousel_comments() {
    var curr = $(".scrollingImagesWrapper.active");
    var next = $(".scrollingImagesWrapper:not(.active)")
    curr.animate({ left: "-1150px" }, 600, "easeInOutBack")
    next.animate({ left: "0" }, 700, "easeInOutBack", function () {
        curr.css({ "left": "1200px" }).removeClass("active")
        next.addClass("active")
        setTimeout(function () { carousel_comments() }, 3000);
    });
}

function openSubMenu(){
    if(!$(this).hasClass('active')){
        $(".navLink").slideUp(80)
        $(".header.only_mobile").removeClass("active")
        $(this).addClass("active")
        $(this).closest('ul').find(".navLink").slideDown(100)
    }else{
        $(".navLink").slideUp(80)
        $(".header.only_mobile").removeClass("active")
        $(this).removeClass("active")
        $(this).closest('ul').find(".navLink").slideUp(100)
    }
}

function minimizeLogo(position) {
    var bLogo = $("#bigger_logo");
    var mLogo = $("#minimize_logo");
    var mPhone = $("#phone_number_mobile");
    if (position && !mLogo.hasClass("active")) {
        mLogo.addClass("active")
        bLogo.animate({ opacity: 0 }, 10)
        $(".logo").animate({ width: "-=130px" }, 200)
        mPhone.animate({ right: "35%", "z-index": 1 }, 450)
        mLogo.animate({ opacity: 1 }, 160)
    } else if (!position && mLogo.hasClass("active")) {
        mLogo.removeClass("active")
        mLogo.animate({ opacity: 0 }, 10)
        $(".logo").animate({ width: "+=130px" }, 200)
        mPhone.animate({ right: 0, "z-index": -1 }, 150)
        bLogo.animate({ opacity: 1 }, 150)
    }
}

$(document).ready(function () {
    EasingFunctions()
    $("#nav-btn").unbind().click(function () {
        if ($(this).hasClass('change')) {
            closeNav()
        } else {
            nav_on_click()
        }
    })
    $(".xNav").unbind().click(closeNav)
    $("#closed_sticker_flag").unbind().click(function () { changeSideStickerPosition(false) })
    setTimeout(function () { carousel(0) }, 500);
    setTimeout(function () { carousel_comments() }, 1000);
    window.addEventListener("orientationchange", function () { location.reload(); });
    $(".header.only_mobile").unbind().click(openSubMenu)
})


$(document).mouseup(function (e) {
    var container = $("nav");
    if ((!container.is(e.target) && container.has(e.target).length === 0)) {
        closeNav()
    }
});

$(document).on("scroll", function () {
    if ($(document).scrollTop() > 20) {
        closeNav()
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            minimizeLogo(true)
            changeSideStickerPosition(true)
        } else {
            $('#return-to-top').fadeIn(200);
            changeSideStickerPosition(true)
        }

    } else {
        closeNav()
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            minimizeLogo(false)
            changeSideStickerPosition(true)
        } else {
            $('#return-to-top').fadeOut(200);
            changeSideStickerPosition(false)
        }
    }
});


function EasingFunctions() {
    $.easing.jswing = $.easing.swing;
    $.extend($.easing,
        {
            def: 'easeInQuad',
            easeInQuad: function (x, t, b, c, d) {
                return c * (t /= d) * t + b;
            },
            easeInOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
                return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
            },
            easeInOutElastic: function (x, t, b, c, d) {
                var s = 1.70158; var p = 0; var a = c;
                if (t == 0) return b; if ((t /= d / 2) == 2) return b + c; if (!p) p = d * (.3 * 1.5);
                if (a < Math.abs(c)) { a = c; var s = p / 4; }
                else var s = p / (2 * Math.PI) * Math.asin(c / a);
                if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
                return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
            },
            easeOutBack: function (x, t, b, c, d, s) {
                if (s == undefined) s = 1.70158;
                return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
            }
        }
    )
}
