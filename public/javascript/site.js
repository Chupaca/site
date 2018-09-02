$(document).ready(function () {
    setFooter();
    setImageBoxHeight();
});

$(window).resize(function () {
    setFooter();
    setImageBoxHeight();
});

$(window).load(function () {
    setFooter();
    setImageBoxHeight();

    //$(".ImgBox").hover(function () {
    //    $(".imgInfo ", this).stop().slideToggle("slow");
    //});
    bindImgBoxesHover();

    if ($("#myDiv").length > 0) {
        checkGalleryHeight();
    }
});

function setImageBoxHeight() {
    var maxHeight = 0;
    $(".ImgBox").css('height', 'auto');
    $(".ImgBox").each(function () {
        if ($(this).height() >= maxHeight)
            maxHeight = $(this).height();
    });
    $(".ImgBox").each(function () {
        $(this).height(maxHeight);
    });
}

var intervalCount = 0;
var totalScrollHeight = 0;
function checkGalleryHeight() {
    var scrollHeight = document.documentElement.scrollHeight;
    if (scrollHeight != totalScrollHeight) {
        totalScrollHeight = scrollHeight;
        setFooter();
        setTimeout(function () { checkGalleryHeight(); }, 100);
    }
    else {
        intervalCount++;
        setFooter();
        if (intervalCount < 20)
            setTimeout(function () { checkGalleryHeight(); }, 100);
    }
}

function setFooter() {
    var footerColumns = $("#FooterLinksContainer .siteMapUl");
    var offset = 60;
    var maxHeight = 0;
    footerColumns.each(function () {
        if ($(this).height() >= maxHeight)
            maxHeight = $(this).height();
    });
    footerColumns.css("min-height", maxHeight + "px");

    $("html").css("height", "auto");
    var footer = $(".site-footer");
    footer.css("position", "static");

    var scrollHeight = document.documentElement.scrollHeight;
    
    //var topStrip = $(".top-strip");
    //var page = $(".page-wrap");
    //var footerHeight = footer[0].clientHeight + offset;
    //page.css("margin-bottom", footerHeight + "px");
    //var clientHeight = document.documentElement.clientHeight + footerHeight;

    //console.log("scrollHeight: " + scrollHeight + " clientHeight: " + clientHeight + " xxx: " + ($("#myDiv").length > 0 ? footerHeight : 0));
    //console.log(scrollHeight + "*" + clientHeight + "*" + page[0].clientHeight + "*" + topStrip[0].clientHeight + "*" + footerHeight + "*" + document.documentElement.clientHeight);
    //console.log(scrollHeight <= document.documentElement.clientHeight);
    //console.log(page[0].clientHeight + topStrip[0].clientHeight + footerHeight > scrollHeight);
    //915*1044*566*336
    if (scrollHeight <= document.documentElement.clientHeight) {
        $("html, body").css("height", "100%");
        footer.css("position", "absolute");
    }
    //if ((scrollHeight > clientHeight) || (page[0].clientHeight + topStrip[0].clientHeight + footerHeight > scrollHeight)) {
        
    //}
    //else {
    //    $("html, body").css("height", "100%");
    //    footer.css("position", "absolute");
    //}
}

var imgBoxs = null;

function bindImgBoxesHover() {
    if (imgBoxs == null)
        imgBoxs = $(".ImgBox, .ImgBoxWide");

    var clientWidth = document.documentElement.clientWidth;
    if (clientWidth > 800) {
        imgBoxs.unbind("hover").hover(function () {
            $(".imgInfo", this).stop().slideDown("slow");
            //$("img", this).css("border-color", "#ffac1d");
        }, function () {
            $(".imgInfo", this).stop().slideUp("slow");
            //$("img", this).css("border-color", "#5e5e5e");
        });
    }
    else {
        imgBoxs.unbind();
    }
}

function resetForm(enable, disable) {
    setTimeout(function () {
        $("[id$=" + enable + "]").css("display", "block");
        $("[id$=" + disable + "]").css("display", "none");
    }, 3000);
}
