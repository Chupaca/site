'use strict'

const device = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
let messageCarouselItem, flag_slide_door = true;

function nav_on_click() {
    if (device) {
        $(".header.only_mobile").removeClass("active");
    }
    $(".nav").slideDown(400);
    $("#nav-btn").addClass("change");
    $("#nav-btn").css("background", "#ffffff");
}

function closeNav(e) {
    if ($("#nav-btn").hasClass('change')) {
        $(".nav").slideUp(400)
        $("#nav-btn").removeClass("change")
        $("#nav-btn").css("background", "#222")
    }
}

function changeSideStickerPosition(hidden) {
    if (hidden && device && !$("#closed_sticker_flag").hasClass("visib")) {
        $("#closed_sticker_flag").addClass("visib").animate({ "right": "6.5vh" }, 300)
        $("#side_sticker").animate({ "right": "-15vh" }, 300)
    } else if (!hidden && device && $("#closed_sticker_flag").hasClass("visib")) {
        $("#closed_sticker_flag").removeClass("visib").animate({ "right": "-18vh" }, 300)
        $("#side_sticker").animate({ "right": "1vh" }, 300)
    }
}

function carousel(myIndex) {
    $(".mySlides").each(function (i, item) {
        if ($(item).hasClass("active")) {
            $(item).animate({
                opacity: 0.1,
                "z-index": 100
            }, 1000)
            $(".slide_inside:eq(" + $(item).index() + ")").css({ "display": "none" })
        }
    });
    ++myIndex
    if (myIndex > $(".mySlides").length) { myIndex = 1 }
    $(".mySlides").eq(myIndex - 1).addClass("active")
    $(".mySlides").eq(myIndex - 1).animate({
        opacity: 1,
        "z-index": 200
    }, 700, function () {
        $(".slide_inside").eq(myIndex - 1).css({ "display": "block" })
        $(".overlay_slides_wrap").animate({
            opacity: "0.7"
        }, 500)
    })

    setTimeout(function () { carousel_addons(true, myIndex) }, 2000);
}

function carousel_addons(slidein, myIndex) {
    if (device) {
        if (slidein) {
            $(".door_img").animate({ opacity: 1, right: "10%" }, 1000)
            $(".door_info_container").animate({ opacity: 1, right: "40%" }, 1000)
            $(".slider_left_text").animate({ opacity: 1, left: "9%" }, 1000)
            setTimeout(function () { carousel_addons(false, myIndex) }, 4000);
        } else {
            $(".door_img").animate({ opacity: 0, right: "0" }, 500)
            $(".door_info_container").animate({ opacity: 0, right: "25%" }, 500)
            $(".slider_left_text").animate({ opacity: 0, left: "-25%" }, 500)
            $(".overlay_slides_wrap").animate({ opacity: 0 }, 800)
            setTimeout(function () { carousel(myIndex) }, 1000);
        }
    } else {
        if (slidein) {
            $(".door_img").animate({ opacity: 1, right: "15%" }, 1000)
            $(".door_info_container").animate({ opacity: 1, right: "40%" }, 1000)
            $(".slider_left_text").animate({ opacity: 1, left: "9%" }, 1000)
            setTimeout(function () { carousel_addons(false, myIndex) }, 4000);
        } else {
            $(".door_img").animate({ opacity: 0, right: "10%" }, 500)
            $(".door_info_container").animate({ opacity: 0, right: "25%" }, 500)
            $(".slider_left_text").animate({ opacity: 0, left: "-25%" }, 500)
            $(".overlay_slides_wrap").animate({ opacity: 0 }, 800)
            setTimeout(function () { carousel(myIndex) }, 1800);
        }
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

function minimizeLogo(position) {
    var bLogo = $("#bigger_logo");
    var mLogo = $("#minimize_logo");
    var mPhone = $("#phone_number_mobile");
    if (position && !mLogo.hasClass("active")) {
        mLogo.addClass("active")
        bLogo.animate({ opacity: 0 }, 10)
        $("#logo_side").animate({ width: "-=130px" }, 200)
        mPhone.animate({ right: "35%", "z-index": 1 }, 450)
        mLogo.animate({ opacity: 1 }, 160)
    } else if (!position && mLogo.hasClass("active")) {
        mLogo.removeClass("active")
        mLogo.animate({ opacity: 0 }, 10)
        $("#logo_side").animate({ width: "+=130px" }, 200)
        mPhone.animate({ right: 0, "z-index": -1 }, 150)
        bLogo.animate({ opacity: 1 }, 150)
    }
}

function scrollPageToFirstElement(e, element) {
    var target_el = $(this);
    var max_top = -100;
    if (element) {
        target_el = element;
        max_top = 250
    }

    $('html, body').animate({ scrollTop: $('#' + $(target_el).attr("data-scrollto")).position().top + max_top }, 600, "easeOutBack");
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
    $(window).off("orientationchange").on("orientationchange", windowOrientationChange)
    $(".downBtn, .event_scroll_to_el").unbind().click(scrollPageToFirstElement);
    $(".project_gallery_row img").unbind().click(previewImageModal);
    accordionEvents();
    $(".infoContactBox.branch_name, .on_map_btn").unbind().click(changeBranchPreview);
    $("#priceofferbtn").unbind().click(popupPriceOffer);
    $(".wrap_image_door").unbind().click(changeChoicePart)
    $(".wrap_image_door[data-pirzul='true']").unbind().click(changeChoicePartPirzul)
    $(".select_part_door").unbind().change(selectChoiceDoorMobile);
    accessibilitySetup();
    var vid = document.getElementById("start_video");
    if (vid) {
        vid.onended = function () {
            $(this).animate({
                "margin-left": "-=2000px",
                "opacity": 0
            }, 700, "easeInOutElastic", function () {
                $(this).css({ "display": "none" })
                $("#cur_wrap").css({
                    "opacity": 0,
                    "display": "block",
                    "margin-left": "-2000px",
                }).animate({
                    "opacity": 1,
                    "margin-left": "+=2000px",
                }, 700, "easeInQuad")
                messageCarouselItem = setInterval(messageCarousel, 4000);
            });
        };
    }
}

$(document).ready(function () {
    EasingFunctions()
    Setup()
    if (window.location.href.indexOf("branches") > -1) {
        branchesOnload()
    }
})


$(document).mouseup(function (e) {
    var container = $("nav");
    if ((!container.is(e.target) && container.has(e.target).length === 0)) {
        closeNav()
    }
});

$(".message_carousel").on('mouseenter', function (e) {
    clearInterval(messageCarouselItem);
    $(this).css({ "background": "#343434", "cursor": "pointer", "transition": "background ease-in-out 0.8s" });
    return;
})
$(".message_carousel").on('mouseleave', function (e) {
    $(this).css("background", "#ff4200");
    messageCarousel();
    messageCarouselItem = setInterval(messageCarousel, 4000);
    return;
})

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

function windowOrientationChange() {
    if ((document.webkitFullscreenElement !== undefined && document.webkitFullscreenElement === null) || (document.msRequestFullscreen !== undefined && document.msRequestFullscreen === null)) {
        location.reload();
    }
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
    $(".branches_descriptions").eq(index).addClass("active");
    if (device) {
        scrollPageToFirstElement(null, this)
    }
}

function changeChoicePart() {
    var img_part = $(this).attr("data-srcpreview");
    var door_description = $(this).attr("data-description") || "";
    var slideSide = $(this).attr("data-slide-side") || false
    if (slideSide) {
        slideDoorAnimation(img_part, door_description)
    } else {
        openAndCloseDoorAnimation(img_part, door_description)

    }
}
function slideDoorAnimation(img_part, door_description) {
    $(".image_door").animate({ textIndent: 90 }, {
        step: function (now, fx) {
            $(".image_door").css({
                'transform': 'rotateY(' + (-now) + 'deg)',
                '-ms-transform': 'rotateY(' + (-now) + 'deg)',
                "transform-origin": "100% 50%",
                "-ms-transform-origin": "100% 50%"
            });
        },
        complete: function () {
            $(".image_door").attr("src", img_part);
            $(".door_description_bottom").text(door_description)
        }
    }, 800, "easeOutBack");

    setTimeout(function () {
        $(".image_door").animate({ textIndent: 0 }, {
            step: function (now, fx) {
                $(".image_door").css({
                    'transform': ' rotateY(' + (-now) + 'deg)',
                    '-ms-transform': 'rotateY(' + (-now) + 'deg)',
                    "transform-origin": " 100% 50%",
                    "-ms-transform-origin": "100% 50%"
                });
            }
        }, 800, "easeOutBack");

    }, 1000);
}

function openAndCloseDoorAnimation(img_part, door_description) {
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
            $(".door_description_bottom").text(door_description)
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


function messageCarousel() {
    let nextSlide = $(".message_carousel div.active").next().hasClass("message_slide") ? $(".message_carousel div.active").next() : $(".message_carousel div").first()
    $(".message_carousel div.active").animate({
        "left": "-=350vh"
    }, 800, "easeInOutBack",
        function () {
            $(this).removeClass("active").css({ "left": "0", "top": "-25vh", "display": "none" });
            $(nextSlide).addClass("active").css({ "display": "block" }).animate({
                "top": 0
            }, 800, "easeInOutBack")
        })
}

function SimpleChangePage(el, page, targetItems, typeDisplay) {
    $("." + targetItems).css({ 'display': 'none' });
    $(".num_page_btn").removeClass("active");
    $(el).addClass("active");
    let pageIndex = $(".num_page_btn.active").index();
    if (pageIndex == $(".num_page_btn").length) {
        $(".num_next_page_btn").css({ 'display': 'none' })
    } else {
        $(".num_next_page_btn").css({ 'display': 'inline-block' });
    }
    if (pageIndex == 1) {
        $(".num_prev_page_btn").css({ 'display': 'none' })
    } else {
        $(".num_prev_page_btn").css({ 'display': 'inline-block' });
    }
    $("." + targetItems + "[data-index=" + page + "]").css({ 'display': typeDisplay });
    $('html, body').animate({ scrollTop: $(".wrap_container").position().top - 100 }, 600, "easeOutBack");
}

function NextSimplePage(targetItems, typeDisplay) {
    $("." + targetItems).css({ 'display': 'none' });
    $(".num_prev_page_btn").css({ 'display': 'inline-block' });
    let pageIndex = $(".num_page_btn.active").index();
    if ((pageIndex + 1) == $(".num_page_btn").length) {
        $(".num_next_page_btn").css({ 'display': 'none' })
    }
    $("." + targetItems + "[data-index=" + (pageIndex + 1) + "]").css({ 'display': typeDisplay });
    $(".num_page_btn.active").removeClass("active").next().addClass("active");
    $('html, body').animate({ scrollTop: $(".wrap_container").position().top - 100 }, 600, "easeOutBack");
}

function PrevSimplePage(targetItems, typeDisplay) {
    $("." + targetItems).css({ 'display': 'none' });
    let pageIndex = $(".num_page_btn.active").index();
    if ((pageIndex - 1) == 1) {
        $(".num_prev_page_btn").css({ 'display': 'none' })
    }
    if ((pageIndex - 1) < $(".num_page_btn").length) {
        $(".num_next_page_btn").css({ 'display': 'inline-block' });
    }
    $("." + targetItems + "[data-index=" + (pageIndex - 1) + "]").css({ 'display': typeDisplay });
    $(".num_page_btn.active").removeClass("active").prev().addClass("active");
    $('html, body').animate({ scrollTop: $(".wrap_container").position().top - 100 }, 600, "easeOutBack");
}

function branchesOnload() {
    const branch = window.location.href.split("/").pop();
    if (Number(branch) && Number(branch) > 0) {
        $(".infoContactBox.hover.branch_name").eq(Number(branch)).trigger("click");
        if (!device) {
            scrollPageToFirstElement(null, $(".infoContactBox.hover.branch_name").eq(Number(branch)))
        }
    } else {
        return true;
    }
}

function validateForm(form) {
    return (Array.from($(form).find("input[type=text]")).every(function (item) {
        $(item).css("background", "#ffffff");
        if ($(item).attr("name") != 'PhoneNumber' && $(item).attr("name") != 'Email') {
            return textValidation($(item).val().trim()) ? true : setFalseFlag(item);
        } else if ($(item).attr("name") == 'Email') {
            return validateEmail($(item).val().trim()) ? true : setFalseFlag(item);
        } else {
            return true
        }
    }))
}

function setFalseFlag(field) {
    $(field).css("background", "#f09494");
    return false;
}

function textValidation(text) {
    let regex = /[a-zA-Zא-ת0-9А-Яа-я]/g
    return regex.test(text);
}

function validateEmail(email) {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))([ ]?,[ ]?(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))*$/;
    return regex.test(email);
}

$('form').submit(function (e) {
    e.preventDefault();
    let parent = $("body");
    let isModal = $(this).attr("data-modal")
    if (isModal) {
        parent = $(this).parent().parent();
    }
    if (validateForm($(this))) {
        $.post($(this).attr('action'), $(this).serialize())
            .then(function (result) {
                Array.from($(".form_input")).forEach(function (item) {
                    $(item).val("").css("background", "#ffffff");
                })
                Flash(result || "נשלח בהצלחה!", "success", parent);
                if (isModal) {
                    setTimeout(function () { $(parent).hide(20).css({ "z-index": 1 }); }, 700)
                }
                return true;
            })
            .fail(function (er) {
                Flash(er.responseText || "התרחשה שגיאה", "error", parent);
                return false;
            })
    } else {
        Flash("לא כל השדות מלאים!", "warning", parent);
        return false;
    }
});


function Flash(message, type, modal) {
    var count = "flash" + Math.floor(Math.random() * Math.floor(1000));
    $(modal).append("<div id='" + count + "' class='flash " + type || '' + " show' dir='rtl'>" + message || '' + "</div>");
    setTimeout(function (count) {
        $("#" + count).animate({ top: "-15vh", opacity: 0 }, 500, function () {
            $("#" + count).remove();
        });
    }, 2000, count);
    return;
}

$("#collection_choice li").unbind().click(changeChoiceModal)
$("#collection_choice li.pirzul").unbind().click(changeChoicePirzul)

function changeChoiceModal() {
    var model = $(this);
    $("#collection_choice li").removeClass("active");
    $(".pirzul_wrap").css({ 'display': 'none' })
    $(model).addClass("active");
    $(".choice_parts_preview_wrap .section_text").html($(model).attr("data-title").trim());
    $(".wrap_image_door").each(function (i, door) {
        if ($(door).attr("data-modelid") == $(model).attr("data-modelid")) {
            $(door).css({ "display": "inline-block" })
        } else {
            $(door).css({ "display": "none" })
        }
    })
    $(".frame_image_door").hide(200)
    var frame_door = $(this).attr("data-frame");
    $(".frame_image_door").attr("src", frame_door).show(600);
    changeChoicePart.call(this)

}

function changeChoicePirzul() {
    const model = $(this);
    $("#collection_choice li").removeClass("active");
    $(model).addClass("active");
    let firstPirzul;
    $(".wrap_image_door").each(function (i, door) {
        if ($(door).attr("data-pirzul")) {
            firstPirzul = $(door)
            $(door).css({ "display": "inline-block" })
        } else {
            $(door).css({ "display": "none" })
        }
    })
    changeChoicePartPirzul.call(firstPirzul)
}

function changeChoicePartPirzul() {
    if (!$(".pirzul_wrap").hasClass('mobile')) {
        $(".pirzul_wrap").css({
            'background': "#ffffff url(" + $(this).attr("data-srcpreview") + ") 50% 43% / 156px 92px no-repeat content-box",
            'box-shadow': '7px 3px 11px 4px rgba(22, 17, 17, 0.74)'
        })
        $(".pirzul_wrap").fadeIn(500)
    } else {
        $(".pirzul_wrap.mobile").css({
            'display': 'block',
            'background': "#ffffff url(" + $(this).attr("data-srcpreview") + ") 50% 43% / 100px 53px no-repeat content-box content-box",
            'box-shadow': 'rgba(22, 17, 17, 0.74) 3px 4px 12px 0px'
        })
    }
}

$(".ss_r").unbind().click(function () {
    if (flag_slide_door) {
        flag_slide_door = false;
        $(".line_preview_doors").animate({
            scrollLeft: $(".line_preview_doors").scrollLeft() + 100
        }, 500, function () {
            flag_slide_door = true;
        })
    }
});

$(".ss_l").unbind().click(function () {
    if (flag_slide_door) {
        flag_slide_door = false;
        $(".line_preview_doors").animate({
            scrollLeft: $(".line_preview_doors").scrollLeft() - 100
        }, 500, function () {
            flag_slide_door = true;
        })
    }
});

function openWithSimpleImageModal(imagTag) {
    $('#preview_image_modal_tag').attr("src", $(imagTag).attr("src"));
    $("#simple_image_preview_modal").show(100);
}

//================== accessibility =======================================

function openAccessibilityOptions() {
    if (device) {
        $(".sticker_description.accessibility").animate({
            'z-index': '7',
            'right': '7vh',
            'height': '65vh',
            'width': '35vh'
        }, 500)
    } else {
        $(".sticker_description.accessibility").animate({
            'z-index': '7',
            'right': '7vh',
            'height': '53vh',
            'width': '35vh'
        }, 500)
    }
    $(".accessibility_wrap").slideDown(200)
}
function closeAccessibilityOptions() {
    $(".accessibility_wrap").slideUp(200)
    $(".sticker_description.accessibility").removeAttr('style')
}

var accessibility = {
    font: 0,
    header: 0,
    links: 0,
    contrast: ''
}

function accessibilitySetup() {
    $(".font_change").unbind().click(accessibilityFont)
    $("#accessibility_header").unbind().click(accessibilityHeaders)
    $("#accessibility_links").unbind().click(accessibilityLinks)
    $(".contrast_change").unbind().click(accessibilityContrastChanges);
    $("#accessibility_reset").unbind().click(function () {
        accessibility = {
            font: 0,
            header: 0,
            links: 0,
            contrast: ''
        }
        setCookyAccessibility()
        location.reload();
    })
    getCookyAccessibility()
}

function getCookyAccessibility() {
    var decodedCookie = decodeURIComponent(document.cookie);
    if (decodedCookie) {
        try {
            accessibility = JSON.parse(decodedCookie.split(';').find(function (item) { if (item.indexOf('accessibility') > -1) return item; }).split('=')[1])
            if (accessibility.header) {
                $("#accessibility_header").trigger('click')
            }
            if (accessibility.links) {
                $("#accessibility_links").trigger('click')
            }
            if (accessibility.contrast) {
                $(".contrast_change[name='" + accessibility.contrast + "']").trigger('click')
            }
            if (accessibility.font != 0) {
                for (var i = 0; i < Math.abs(accessibility.font); i++) {
                    $(".font_change[name='" + (accessibility.font > 0 ? 'plus' : 'minus') + "']").trigger('click')
                }
            }
        } catch (err) {
            return
        }
    }
}

function accessibilityFont(e) {
    if ($(this).attr('name') == 'plus') {
        $("body *").not(".accessibility *").css("fontSize", '+=0.5px');
        if (e.originalEvent) {
            accessibility.font++
            setCookyAccessibility()
        }
    } else if ($(this).attr('name') == 'minus') {
        $("body *").not(".accessibility *").css("fontSize", '-=0.5px');
        if (e.originalEvent) {
            accessibility.font--
            setCookyAccessibility()
        }
    }
}

function accessibilityHeaders(e) {
    $(this).toggleClass('active')
    if (e.originalEvent) {
        accessibility.header = !accessibility.header ? 1 : 0;
        setCookyAccessibility()
    }
    if (!accessibility.header) {
        $("body").removeClass("accessibility_header");
    }
    else {
        $("body").not(".accessibility h3").addClass("accessibility_header");
    }

}


function accessibilityLinks(e) {
    $(this).toggleClass('active')
    if (e.originalEvent) {
        accessibility.links = !accessibility.links ? 1 : 0;
        setCookyAccessibility()
    }
    if (!accessibility.links) {
        $("body a").removeClass("accessibility_links");
    }
    else {
        $("body a").not(".accessibility a").addClass("accessibility_links");
    }
}

function accessibilityContrastChanges(e) {
    $(".contrast_change").not(this).removeClass("active");
    $(this).toggleClass('active')
    if (e.originalEvent) {
        accessibility.contrast = $(this).attr('name').trim() || '';
    }

    if (accessibility.contrast == 'gray') {
        if ($("html").hasClass("accessibility_contrast_gray")) {
            accessibility.contrast = '';
            clearAllContrast()
        }
        else {
            clearAllContrast()
            $("html").addClass("accessibility_contrast_gray");
        }
    }

    if (accessibility.contrast == 'dark') {
        if ($("body").hasClass("accessibility_contrast_dark")) {
            accessibility.contrast = '';
            clearAllContrast()
        }
        else {
            clearAllContrast()
            $("body").addClass("accessibility_contrast_dark");
        }

    }

    if (accessibility.contrast == 'bright') {
        if ($("body").hasClass("accessibility_contrast_bright")) {
            accessibility.contrast = '';
            clearAllContrast()
        }
        else {
            clearAllContrast()
            $("body").addClass("accessibility_contrast_bright");
        }

    }
    setCookyAccessibility()
}

function clearAllContrast() {
    $("html").removeClass("accessibility_contrast_gray").removeClass("accessibility_contrast_dark").removeClass("accessibility_contrast_bright");
    $("body").removeClass("accessibility_contrast_gray").removeClass("accessibility_contrast_dark").removeClass("accessibility_contrast_bright");
}

function setCookyAccessibility() {
    var d = new Date();
    d.setTime(d.getTime() + (10 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "accessibility=" + JSON.stringify(accessibility) + ";" + expires + ";path=/";
}

$(document).keyup(function (e) {
    if (e.which == 9 || e.keyCode == 9) {
        var elem = $(document.activeElement);
        elem.toggleClass("focused", elem.is(":focus"));
        if ($._data($(document.activeElement)[0], 'events') && $._data($(document.activeElement)[0], 'events').click) {
            $(document.activeElement).trigger('click')
        }
        $(document.activeElement).blur(function(){
            var elem = $(this)
            elem.toggleClass("focused", elem.is(":focus"));
        });
        e.stopPropagation()
    }
});

//================== end accessibility =======================================