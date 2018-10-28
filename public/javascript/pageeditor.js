function setupPageEditors() {
    $("#add_new_meta").unbind().click(addNewMeta)
    $(".remove_row_meta").unbind().click(removeMetaRow);
    $(".edit_meta_row").unbind().click(editMetaRow);
    $(".switch_wraps").unbind().click(function () {
        $(".switch_wraps").removeClass("active")
        $(".wrap_three_col, .wrap_two_col").hide(5);
        $(this).addClass("active")
        $(".wrap_three_col[data-wrap='" + $(this).attr("data-wrap") + "'], .wrap_two_col[data-wrap='" + $(this).attr("data-wrap") + "']").toggle()
    })
    $(".open_headers_gallery").unbind().click(function(){
        var bucket = $(this).attr("data-bucket")
        OpenPreviewGallery(bucket, (imageIds)=>{
            imageIds.forEach(imageId => {
                $(".wrap_images_[data-wrap_images='" + bucket + "']").append(`
                <div class="gallery_image " data-imageid="${imageId}">
                <img class="image_one" data-index="0" src="https://storage.googleapis.com/pandoor_test_site_${bucket}/${imageId}" alt="">
                <div class="desc">
                        <span>${imageId}</span>  
                </div>
                </div>
                `)
            })
           
        })
    });
}


function addNewMeta() {
    $(".meta_data_table tbody").append(`
    <tr>
            <td style="width: 20vh;">
                <select>
                <option>Description</option>
                <option>Keywords</option>
                </select>
            </td>
            <td><input value="" /></td>
            <td style="width: 25vh;">
                <button class="btn_class edit_row">change</button>
            </td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
    </tr>
    `)
    $(".remove_row_meta").unbind().click(removeMetaRow);
    $(".edit_meta_row").unbind().click(editMetaRow);
}

function removeMetaRow() {
    $(this).closest("tr").remove();
}

function editMetaRow() {
    $(this).closest("tr").find("input").removeAttr("readonly");
    $(this).closest("tr").find("select").removeAttr("disabled");
}