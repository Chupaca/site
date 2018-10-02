'use strict'


var firstRun = true;

$(document).mouseup(function (e) {
    var container = $(".nav");
    // if the target of the click isn't the container nor a descendant of the container
    if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.fadeOut();
    }
});

$(document).on("scroll", function () {
    if ($(document).scrollTop() > 100) {
        $("a.logoMobile").addClass("small");
        $('#return-to-top').fadeIn(200);
        changeSideStickerPosition(true)
        if (document.documentElement.clientWidth > 900) {
            var nav = $('.nav');
            if (nav.css("display") == "block") {
                nav.verticalFade({
                    duration: 'slow',
                });
            }
        }
    } else {
        changeSideStickerPosition(false)
        $('#return-to-top').fadeOut(200);
        $("a.logoMobile").removeClass("small");
    }
});

function changeSideStickerPosition(hidden) {
    if(hidden && !$("#closed_sticker_flag").hasClass("visib")){
        $("#side_sticker").animate({"right" : "-15vh"}, 300)
        $("#closed_sticker_flag").css("display", "block").addClass("visib")
    }else if(!hidden && $("#closed_sticker_flag").hasClass("visib")){
        $("#side_sticker").animate({"right" : "1vw"}, 300)
        $("#closed_sticker_flag").css("display", "none").removeClass("visib")
    }
}


$(document).ready(function () {

    $("#closed_sticker_flag").click(()=>{
        changeSideStickerPosition(false)
    })
    wrapBoxes();

    if (document.documentElement.clientWidth > 900)
        bindCycleDesktop();
    else
        bindCycleMobile();

    var scrollingImageContainer = $(".scrollingImageContainer");
    var scrollingImageContainerMaxHeight = 0;

    $(".scrollingImageContainer").each(function (index) {
        if (this.clientHeight > scrollingImageContainerMaxHeight)
            scrollingImageContainerMaxHeight = this.clientHeight;
    });

    scrollingImageContainer.css("height", scrollingImageContainerMaxHeight + "px");

    
    $(".nav-btn").click(function () {
        $(".nav").verticalFade({
            duration: 'slow',
        });
    });

    $(".xNav").click(function () {
        $(".nav").verticalFade({
            duration: 'slow',
        });
    });

    $("#ContactFormTrigger").hover(
        function () {
            $("#ContactFormContainer").fadeIn();
        }, function () {
            $("#ContactFormContainer").fadeOut();
        }
    );

    $("#LikeButtonTrigger").hover(
        function () {
            $("#LikeButtonContainer").fadeIn();
        }, function () {
            $("#LikeButtonContainer").fadeOut();
        }
    );

    
    $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0                       // Scroll to top of body
        }, 500);
    });

    if (document.documentElement.clientWidth <= 900) {
        $(".header").click(function () {
            var context = $(this).closest("ul");
            var navLinks = $(".navLink", context);
            var sender = $(this);

            navLinks.verticalFade({
                duration: 'slow',
                complete: function () {
                    if (sender.closest("ul").find(".navLink:first").css("display") == "none") {
                        sender.removeClass("orangeText"); //black
                        sender.removeClass("active");
                    }
                    else {
                        sender.addClass("orangeText"); //orange
                        sender.addClass("active");
                    }
                },
                start: function () {
                    if (sender.closest("ul").find(".navLink:first").css("display") == "none") {
                        sender.removeClass("orangeText"); //black
                        sender.removeClass("active");
                    }
                    else {
                        sender.addClass("orangeText"); //orange
                        sender.addClass("active");
                    }
                }
            });
        });
    }
});



$(window).resize(function () {
    wrapBoxes();
});

var currentClientWidth = 0;

function wrapBoxes() {
    var clientWidth = document.documentElement.clientWidth;
    if (clientWidth == currentClientWidth)
        return;

    currentClientWidth = clientWidth;

    var boxesContainer = $("#HomeScrollingImagesBlockContainer");
    if (firstRun == false)
        boxesContainer.cycle('destroy');

    firstRun = false;

    var clientWidth = document.documentElement.clientWidth;
    var boxesInGroup = 2;

    if (clientWidth > 800)
        boxesInGroup = 2;
    else if (clientWidth < 800 && clientWidth >= 0)
        boxesInGroup = 1;

    var boxes = $(".scrollingImageContainer", boxesContainer);
    boxes.css("width", (100 / boxesInGroup) + "%");
    boxesContainer.empty();

    var boxesTemplateWrapper = $('<div class="scrollingImagesWrapper"></div>');

    var counter = 0;
    var totalCounter = 0;
    var boxesTemplateDup = boxesTemplateWrapper.clone();

    boxes.each(function () {
        if (counter < boxesInGroup)
            boxesTemplateDup.append(this);

        counter++;
        totalCounter++;

        if (counter == boxesInGroup || totalCounter == boxes.length) {
            boxesContainer.append(boxesTemplateDup);
            boxesTemplateDup = boxesTemplateWrapper.clone();
            counter = 0;
        }
    });

    $.easing.custom = function (x, t, b, c, d) {
        var s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    }

    $("#HomeScrollingImagesBlockContainer").cycle({
        cycleSwipe: true,
        log: false,
        fx: 'scrollHorz',
        slides: 'div.scrollingImagesWrapper',
        speed: 600,
        timeout: 3000,
        pause: 1,
        easing: 'custom'
    });
}

function bindCycleDesktop() {
    $('.cycle.desktop').on('cycle-initialized', function (event, optionHash) {
        clearTimeouts();

        desktopAnimation($(".cycle.desktop .cycle-slide-active"));

        $(".preloaderContainer").fadeOut(1000, function () {
            $("body").css("height", "auto").css("overflow", "auto");
        });
    });

    $('.cycle.desktop').cycle({
        fx: 'fade',
        pager: '.pager',
        speed: 1000,
        timeout: 10000,
        pause: 1,
        slides: "> div.slide"
    });

    $('.cycle.desktop').on('cycle-after', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
        clearTimeouts();
        desktopAnimation(incomingSlideEl);

        $(".overlay, .door-img, .door-info-container", outgoingSlideEl).css("display", "none");

        $(".slider-txt", outgoingSlideEl).css("left", "-505px");
    });
}

function desktopAnimation(context) {
    window["to_bg"] = setTimeout(function () {
        $(".overlay:first", context).fadeTo("slow", 0.8, function () {
            // overlay Animation complete.
            var $slide = $(this).closest(".slide")

            window["to_door"] = setTimeout(function () {
                $(".door-img, .door-info-container", $slide).fadeIn(3000);

                window["to_text"] = setTimeout(function () {
                    //$(".slider-txt", $slide).fadeIn(3000);
                    $(".slider-txt", $slide).animate({ left: '50px', opacity: 1 }, {
                        duration: 1200,
                        easing: 'easeOutQuart'
                    });
                }, 400);
            }, 300);
        });
    }, 800);
}

function bindCycleMobile() {
    $('.cycle.mobile').cycle({
        cycleSwipe: true,
        log: false,
        fx: 'scrollHorz',
        pager: '.pagerMobile',
        speed: 600,
        timeout: 10000,
        pause: 1,
        slides: "> .slideMobile"
    });
}

function clearTimeouts() {
    if (window["to_bg"] != null && window["to_bg"] != undefined)
        clearTimeout(window["to_bg"]);

    if (window["to_door"] != null && window["to_door"] != undefined)
        clearTimeout(window["to_door"]);

    if (window["to_text"] != null && window["to_text"] != undefined)
        clearTimeout(window["to_text"]);
}



//======================
carousel(0);

function carousel(myIndex) {
    document.getElementsByClassName("overlay_new")[0].style.display = 'none'
    let slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';  
    }
    myIndex++;
    if (myIndex > slides.length) {myIndex = 1}    
    slides[myIndex-1].style.display = 'block';
    setTimeout((myIndex) => { carousel(myIndex)}, 12000, myIndex);
    setTimeout(carousel_addons, 2000);
    
}

function carousel_addons(){
    document.getElementsByClassName("overlay_new")[0].style.display = 'block';
    document.getElementsByClassName("door_img")[0].style.display = 'block';
    document.getElementsByClassName("door_info_container")[0].style.display = 'block';
}