'use strict'


function setup() {
    $("#pages").unbind().click(function () {
        changeStatusItemsNav($(this).closest(".nav_item"));
        $(".pages_list").css({ "margin-right": "0" })
    })
}

function changeStatusItemsNav(item) {
    $(".nav_item").removeClass("active")
    $(item).addClass("active");
    $(".pages_list").removeAttr("style");
}

function ConformModal(text, callbackConform, callbackCancel) {
    $("#conform_modal").find("h2").text(text)
    $("#conform_modal").css({ "display": "block", "z-index": 3000 });
    $("#conformbtn").unbind().on("click", function (e) {
        e.preventDefault();
        if (callbackConform) {
            callbackConform(true);
        }
        $("#conform_modal").css({ "display": "none", "z-index": -1 });
    })

    $("#cancelbtn").unbind().on("click", function (e) {
        e.preventDefault();
        if (callbackCancel) {
            callbackCancel(true);
        }
        $("#conform_modal").css({ "display": "none", "z-index": -1 });
    })
}

function OpenPreviewGallery(bucket, callback) {
    var checked_image = [];
    $.get({ url: "/admin/allimages?bucket=" + bucket, cache: false })
        .then(gallery => {
            $("#preview_modal_gallery").find("h2").text("headers")
            $("#modal_preview_gallery_wrap").html(gallery)
            $("#preview_modal_gallery").css({ "display": "block", "z-index": 3000 });
            $("#modal_preview_gallery_wrap .remove_file").remove();

            $(".image_one").unbind().click(function () {
                if($(this).hasClass("active")){
                    checked_image.splice(checked_image.indexOf($(this).parent().attr("data-imageid"), 1));
                }else{
                    checked_image.push($(this).parent().attr("data-imageid"));
                }
                $(this).toggleClass("active")
                return;
            })
            $("#check_item").unbind().click((e) => {
                e.preventDefault();
                callback(checked_image);
                $("#preview_modal_gallery").css({ "display": "none", "z-index": -1 });
                return;
            })
            $("#close_modal").unbind().click((e) => {
                e.preventDefault();
                $("#preview_modal_gallery").css({ "display": "none", "z-index": -1 });
                return
            })

        })
}


$(document).ready(() => {
    setup();
})
