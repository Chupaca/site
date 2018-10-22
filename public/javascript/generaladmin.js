'use strict'







function setup() {
    $("#images_gallery").unbind().click(getAllGallery);

}

function getAllGallery() {
    $.get("/admin/allimages")
        .then(gallery => {
            $(".container").html(gallery);
            $(".upload_btn").unbind().click(() => {
                $("#upload_modal").css({ "display": "block", "z-index": 3000 });
            })
            $(".close_modal").unbind().click(function () {
                $(this).closest(".modal").css({ "display": "none", "z-index": -1 })
            })
            SetupUploadFunctions()
        })
}




setup();