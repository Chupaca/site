'use strict'

function setupPageEditors() {
    changeStatusItemsNav($("#pages"));
    $(".pages_list").css({ "margin-right": "0" });
    $("#add_new_meta").unbind().click(addNewMeta)
    $(".remove_row_meta").unbind().click(removeMetaRow);
    $(".edit_meta_row").unbind().click(editMetaRow);
    $(".remove_file").unbind().click(removeImage)
    $(".switch_wraps").unbind().click(function () {
        $(".switch_wraps").removeClass("active")
        $(".wrap_three_col, .wrap_two_col").hide(5);
        $(this).addClass("active")
        $(".wrap_three_col[data-wrap='" + $(this).attr("data-wrap") + "'], .wrap_two_col[data-wrap='" + $(this).attr("data-wrap") + "']").toggle()
    })
    $(".open_gallery").unbind().click(function () {
        var bucket = $(this).attr("data-bucket")
        OpenPreviewGallery(bucket, (imageIds) => {
            if (imageIds && imageIds.length > 1 && bucket == "headers") {
                Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
            } else {
                imageIds.forEach(imageId => {
                    $(".wrap_images_[data-wrap_images='" + bucket + "']").append(`
                <div class="gallery_image " data-imageid="${imageId}">
                <img class="image_one" data-imageid="${imageId}" src="https://storage.googleapis.com/pandoor_test_site_${bucket}/${imageId}" alt="">
                <div class="desc">
                        <span>${imageId.slice(14)}</span>
                        <i class="fas fa-trash-alt remove_file" data-imageid="${imageId}"></i>
                </div>
                </div>
                `)
                })
                $(".remove_file").unbind().click(removeImage)
            }
        })
    });
    $(".text_formated").unbind().click(function () {
        var newWin = window.open('https://wordtohtml.net/', '', 'width=900,height=700');
        newWin.document.close();
    })
    $(".text_area_page_editor").unbind("paste").on("paste", function (event) {
        $(this).next().html(event.originalEvent.clipboardData.getData('text'))
        $(this).next().toggle()
        $(this).toggle();
    })
    $(".remove_text").unbind().click(function () {
        let parent = $(this).closest(".col");
        $(parent).find(".text_area_page_editor").text("").toggle();
        $(parent).find(".original_html_text").empty().toggle();
    })

    $("#publish_changes").unbind().click(publishNew)
}

function removeImage() {
    let imageName = $(this).attr("data-imageid");
    ConformModal("האם אתה רוצה למחוק קובץ?", () => {
        Flash("נמחק בהצלחה!", 'success');
        $(".gallery_image[data-imageid='" + imageName + "']").remove();
    })
}

function addNewMeta() {
    $(".meta_data_table tbody").append(`
    <tr>
            <td style="width: 20vh;">
                <select class='type_meta_select'>
                <option value="description" selected>Description</option>
                <option value="keywords">Keywords</option>
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


$(document).ready(() => {
    setupPageEditors()
})
