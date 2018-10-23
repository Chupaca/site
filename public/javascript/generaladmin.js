'use strict'


function setup() {
    $("#images_gallery").unbind().click(getAllGallery);
}

function changeStatusItemsNav(item){
    $(".nav_item").removeClass("active")
    $(item).addClass("active");
}

function getAllGallery() {
    changeStatusItemsNav($(this).closest(".nav_item"))
    $.get("/admin/allimages")
        .then(gallery => {
            $(".container").html(gallery);
            SetupUploadFunctions()
        })
}




setup();