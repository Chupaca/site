'use strict'


function setup() {
    $("#navigation_edit").unbind().click(NavigationEdit);
    $("#footer_edit").unbind().click(FooterEdit);
    $("#images_gallery").unbind().click(getAllGallery);
}

function changeStatusItemsNav(item) {
    $(".nav_item").removeClass("active")
    $(item).addClass("active");
}

function getAllGallery() {
    changeStatusItemsNav($(this).closest(".nav_item"))
    $.get({url: "/admin/allimages", cache: false})
        .then(gallery => {
            $(".container").html(gallery);
            SetupUploadFunctions()
        })
}


function ConformModal(text, callbackConform, callbackCancel) {
    $("#conform_modal").find("h2").text(text)
    $("#conform_modal").css({ "display": "block", "z-index": 3000 });
    $("#conformbtn").unbind().on("click", function (e) {
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


$(document).ready(() => {
    setup();
})
