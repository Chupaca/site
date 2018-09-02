(function ($) {
    var getUnqueuedOpts = function (opts) {
        return {
            queue: false,
            duration: opts.duration,
            easing: opts.easing
        };
    };
    $.fn.showDown = function (opts) {
        opts = opts || {};
        $(this).stop().hide().slideDown(opts).animate({ opacity: 1 }, getUnqueuedOpts(opts));
    };
    $.fn.hideUp = function (opts) {
        opts = opts || {};
        $(this).stop().show().slideUp(opts).animate({ opacity: 0 }, getUnqueuedOpts(opts));
    };
    $.fn.verticalFade = function (opts) {
        opts = opts || {};
        if ($(this).is(':visible')) {
            $(this).hideUp(opts);
        } else {
            $(this).showDown(opts);
        }
    };
}(jQuery));