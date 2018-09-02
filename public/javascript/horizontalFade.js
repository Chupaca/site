(function ($) {
    var getUnqueuedOpts = function (opts) {
        return {
            //queue: false,
            duration: opts.duration,
            easing: opts.easing,
            progress: opts.progress,
            complete: opts.complete
        };
    };
    $.fn.showLeft = function (opts) {
        opts = opts || {};
        $(this).stop().animate({ opacity: 0, width: 'toggle' }, getUnqueuedOpts(opts));
    };
    $.fn.hideRight = function (opts) {
        opts = opts || {};
        $(this).stop().animate({ opacity: 1, width: 'toggle' }, getUnqueuedOpts(opts));
    };
    $.fn.horizontalFade = function (opts) {
        opts = opts || {};
        if ($(this).is(':visible')) {
            $(this).showLeft(opts);
        } else {
            $(this).hideRight(opts);
        }
    };
}(jQuery));