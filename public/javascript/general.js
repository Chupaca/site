'use strict'

var device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function nav_on_click() {
    if (device) {
        $(".navLink").slideUp(1)
        $(".header.only_mobile").removeClass("active")
    }
    $(".nav").slideDown(400)
    $("#nav-btn").addClass("change")
    $("#nav-btn").css("background", "#ffffff")
}

function closeNav(e) {
    if ($("#nav-btn").hasClass('change')) {
        $(".nav").slideUp(400)
        $("#nav-btn").removeClass("change")
        $("#nav-btn").css("background", "#222")
    }
}

function changeSideStickerPosition(hidden) {
    if (hidden && !$("#closed_sticker_flag").hasClass("visib")) {
        $("#closed_sticker_flag").addClass("visib").animate({ "right": "6vh" }, 300)
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
                opacity: 0.1,
                "z-index" :100
            }, 1000)
            $(".slide_inside:eq(" + $(item).index() + ")").css({ "display": "none" })
        }
    });
    ++myIndex
    if (myIndex > $(".mySlides").length) { myIndex = 1 }
    $(".mySlides").eq(myIndex - 1).addClass("active")
    $(".mySlides").eq(myIndex - 1).animate({
        opacity: 1,
        "z-index" :200
    }, 1000, function () {
        $(".slide_inside").eq(myIndex - 1).css({ "display": "block" })
        $(".overlay_slides_wrap").animate({
            opacity: "0.7"
        }, 500)
    })

    setTimeout(function () { carousel_addons(true, myIndex) }, 2000);
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
        setTimeout(function () { carousel(myIndex) }, 2000);
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

function openSubMenu() {
    if (!$(this).hasClass('active')) {
        $(".navLink").slideUp(80)
        $(".header.only_mobile").removeClass("active")
        $(this).addClass("active")
        $(this).closest('ul').find(".navLink").slideDown(100)
    } else {
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

function scrollPageToFirstElement() {
    $('html').animate({ scrollTop: $('#' + $(this).attr("data-scrollto")).position().top - 100 }, 600, "easeOutBack");
}

function Setup() {
    $("#nav-btn").unbind().click(function () {
        if ($(this).hasClass('change')) {
            closeNav()
        } else {
            nav_on_click()
        }
    });
    $(".xNav").unbind().click(closeNav);
    $("#closed_sticker_flag").unbind().click(function () { changeSideStickerPosition(false) });
    carousel(1);
    setTimeout(function () { carousel_comments() }, 1000);
    window.addEventListener("orientationchange", function () { location.reload(); });
    $(".header.only_mobile").unbind().click(openSubMenu);
    $(".downBtn").unbind().click(scrollPageToFirstElement);
    $(".project_gallery_row img").unbind().click(previewImageModal);
    accordionEvents();
    $(".infoContactBox.branch_name, .on_map_btn").unbind().click(changeBranchPreview);
    $("#priceofferbtn").unbind().click(popupPriceOffer);
    $(".part_preview").unbind().click(changeChoicePart)
    $(".select_part_door").unbind().change(selectChoiceDoorMobile)
}

$(document).ready(function () {
    EasingFunctions()
    Setup()
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
        if (device) {
            minimizeLogo(true)
            changeSideStickerPosition(true)
        } else {
            $('#return-to-top').fadeIn(200);
            changeSideStickerPosition(true)
        }

    } else {
        closeNav()
        if (device) {
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

function accordionEvents() {
    $(".accordion_row").unbind().click(function () {
        if ($(this).hasClass("active_row_acc")) {
            $(this).next().slideUp(350)
        } else {
            $(".accordion_row.active_row_acc").next().slideUp(350)
            $(".accordion_row.active_row_acc").removeClass("active_row_acc")
            $(this).next().slideDown(350)
        }
        $(this).toggleClass("active_row_acc");
    });
}

function previewImageModal() {
    var currImg = Number($(this).attr("data-index"))
    $("#count_images").html((currImg + 1) + "/" + $(".project_gallery_row img").length)
    $("#project_preview_modal").css({ "display": "block", "z-index": 3000 });
    $("#preview_image").attr("src", this.src);
    $("#project_preview_modal .close").unbind().click(function () {
        $("#project_preview_modal").css({ "display": "none", "z-index": 1 });
    })
    $("#project_preview_modal .next").unbind().click(function () {
        currImg++
        if (currImg == $(".project_gallery_row img").length) currImg = 0;
        $("#preview_image").attr("src", $(".project_gallery_row img[data-index='" + currImg + "']").attr("src"));
        $("#count_images").html((currImg + 1) + "/" + $(".project_gallery_row img").length)
    })
    $("#project_preview_modal .prev").unbind().click(function () {
        currImg--
        if (currImg == -1) currImg = $(".project_gallery_row img").length - 1;
        $("#preview_image").attr("src", $(".project_gallery_row img[data-index='" + currImg + "']").attr("src"));
        $("#count_images").html((currImg + 1) + "/" + $(".project_gallery_row img").length)
    })
    $("#project_preview_modal").on('touchstart', function (e) {
        var swipe = e.originalEvent.touches;
        var start = swipe[0].pageX;
        var distance;
        $(this).on('touchmove', function (e) {
            var contact = e.originalEvent.touches;
            var end = contact[0].pageX;
            distance = end - start;
        })
            .one('touchend', function () {
                if (distance < -30) {
                    currImg++
                    if (currImg == $(".project_gallery_row img").length) currImg = 0;
                } else if (distance > 30) {
                    currImg--
                    if (currImg == -1) currImg = $(".project_gallery_row img").length - 1;
                }
                $("#preview_image").attr("src", $(".project_gallery_row img[data-index='" + currImg + "']").attr("src"));
                $("#count_images").html((currImg + 1) + "/" + $(".project_gallery_row img").length)
            });
    });
}

function popupPriceOffer() {
    $("#priceoffer_popup").css({ "display": "block", "z-index": 3000 });
    $("#priceoffer_popup").unbind().click(function (e) {
        var container = $("#ContactFormContainer");
        if ((!container.is(e.target) && container.has(e.target).length === 0)) {
            $(this).css({ "display": "none", "z-index": 1 });
        }
    })
}

function changeBranchPreview() {
    $(".infoContactBox.branch_name, .on_map_btn").removeClass("active")
    $(".branches_descriptions").removeClass("active");
    var index;
    if ($(this).attr("data-index")) {
        $(".infoContactBox.branch_name").eq($(this).attr("data-index")).addClass("active");
        index = $(this).attr("data-index")
    } else {
        $(".on_map_btn[data-index=" + $(this).index() + "]").addClass("active");
        index = $(this).index()
    }
    $(this).addClass("active")
    $(".branches_descriptions").eq(index).addClass("active")
}

function changeChoicePart() {
    var img_part = $(this).attr("data-large-door");
    $(".for_fun_after_door").css({ "display": "" });

    $(".image_door").animate({ textIndent: 85 }, {
        step: function (now, fx) {
            $(".image_door").css({
                'transform': 'perspective(1000px) rotateY(' + (-now) + 'deg)',
                '-ms-transform': 'perspective(1000px) rotateY(' + (-now) + 'deg)',
                "transform-origin": "100% 50%",
                "-ms-transform-origin": "100% 50%"
            });
        },
        complete: function () {
            $(".image_door").attr("src", img_part);
        }
    }, 800, "easeOutBack");

    setTimeout(function () {
        $(".image_door").animate({ textIndent: 0 }, {
            step: function (now, fx) {
                $(".image_door").css({
                    'transform': 'perspective(1000px) rotateY(' + (-now) + 'deg)',
                    '-ms-transform': 'perspective(1000px) rotateY(' + (-now) + 'deg)',
                    "transform-origin": " 100% 50%",
                    "-ms-transform-origin": "100% 50%"
                });
            }
        }, 800, "easeOutBack");
    }, 1000);
}

function selectChoiceDoorMobile() {
    var img_part = $(".select_part_door option:selected").val();
    setTimeout(function () {
        $(".image_door").animate({
            opacity: 0
        }, 300, function () {
            $(".image_door").attr("src", img_part);
            $(".image_door").animate({
                opacity: 1
            }, 300)
        })
    }, 0)

}