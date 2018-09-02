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

        if (document.documentElement.clientWidth > 900) {
            var nav = $('.nav');
            if (nav.css("display") == "block") {
                nav.verticalFade({
                    duration: 'slow',
                });
            }
        }
    } else {
        $("a.logoMobile").removeClass("small");
    }

});

$(document).ready(function () {
    //$(".contactTab").click(function () {
    //    $(".contactTab > div").fadeToggle();
    //});
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
        //    if ($(".nav").css("left") = "0") {
        //        $(".nav").animate({ left: '-800px' });
        //    }
        //    else if ($(".nav").css("left") = "-800px")
        //        $(".nav").animate({ left: '0' });
        //    }

        //var context = $(".nav");
        //if (context.css("display") == "block") {

        //}
        //else {

        //}
        //$(".nav").fadeToggle();

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

    $('.architectTab').stickyfloat({
        duration: 1000,
        easing: 'easeOutBack',
        offsetY: 150
    });

    $('.liketab').stickyfloat({
        duration: 1000,
        easing: 'easeOutBack',
        offsetY: 235
    });

    $('.contactTab').stickyfloat({
        duration: 1000,
        easing: 'easeOutBack',
        offsetY: 320
    });

    $("#LikeButtonTrigger").hover(
        function () {
            $("#LikeButtonContainer").fadeIn();
        }, function () {
            $("#LikeButtonContainer").fadeOut();
        }
    );

    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
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
            //orangNavIcon.png
            //active
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
    //$('.cycle.mobile').on('cycle-initialized', function (event, optionHash) {
    //    if (t != null)
    //        clearTimeout(t);

    //    t = setTimeout(function () {
    //        $(".cycle.mobile .cycle-slide-active .overlay").fadeTo("slow", 0.7, function () {
    //            // overlay Animation complete.
    //            $(".slider-txt", $(this).closest(".slideMobile")).animate({ left: '50px' }, "slow");
    //        });
    //    }, 1000);
    //});

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


    //$.easing.custom = function (x, t, b, c, d) {
    //    var s = 1.70158;
    //    if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
    //    return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
    //}

    //$('.cycle.mobile').on('cycle-after', function (event, optionHash, outgoingSlideEl, incomingSlideEl, forwardFlag) {
    //    if (t != null)
    //        clearTimeout(t);

    //    t = setTimeout(function () {
    //        $(".overlay", incomingSlideEl).fadeTo("slow", 0.7, function () {
    //            // overlay Animation complete.
    //            $(".slider-txt", incomingSlideEl).animate({ left: '50px' }, "slow");
    //        });
    //    }, 1000);
    //    $(".slider-txt", outgoingSlideEl).css("left", "-40%");
    //    $(".overlay", outgoingSlideEl).css("opacity", "0");
    //});

    $(".preloaderContainer").fadeOut(1000, function () {
        $("body").css("height", "auto").css("overflow", "auto");
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

