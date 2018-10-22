'use strict'



$("#images_gallery").unbind().click(()=>{
    $.get("/admin/allimages")
        .then(gallery => {
            $(".container").html(gallery)
        })
})