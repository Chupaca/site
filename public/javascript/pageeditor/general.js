'use strict'

function setupPageEditors() {
    changeStatusItemsNav($("#pages"));
    $(".pages_list").css({ "margin-right": "0" });
    $(".pages_list [data-page='" + window.location.href.split("page=")[1] + "'] li").css({ "background": "#ffffff", "color": "#749cf3" })

    $("#add_new_meta").unbind().click(addNewMeta)
    $(".remove_row_meta").unbind().click(removeMetaRow);
    $(".edit_meta_row").unbind().click(editMetaRow);
    $(".remove_file").unbind().click(removeImage);

    $(".switch_wraps").unbind().click(function () {
        if (!$(this).hasClass("active")) {
            $(".switch_wraps").removeClass("active")
            $(".wrap_three_col, .wrap_two_col").hide(5);
            $(this).addClass("active")
            $(".wrap_three_col[data-wrap='" + $(this).attr("data-wrap") + "'], .wrap_two_col[data-wrap='" + $(this).attr("data-wrap") + "']").toggle()
        }
        if($(this).attr("data-wrap") == "versions"){
            $("#save_new").prop("disabled", true)
        }else{
            $("#save_new").prop("disabled", false)
        }
    })

    $("#sortable, #sortable_tmp").sortable({
        connectWith: ".connectedSortable",
        stop: () => { sortNavItemsAfterChange() }
    }).disableSelection();

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
    TextEvents();
    accordionEvents();
    $("#add_row_accardion").unbind().click(addRowAccordion)
    $("#save_new").unbind().click(saveNewPage);
    $("#publish_page").unbind().click(publishPage);
    $(".list_table tr").unbind().click(markRow);
    sortNavItemsAfterChange();
    $(".page_item").unbind().click(markVersionPage);
    $("#preview_page").unbind().click(PreviewPage);
    $(".remove_page").unbind().click(removePage)
}

function sortNavItemsAfterChange() {
    $("#sortable li").each((i, item) => {
        $(item).find(".page_item_position").text(i + 1)
    })
    $("#sortable_tmp li").each((i, item) => {
        $(item).find(".page_item_position").text(0)
    })
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
                <button class="btn_class edit_row">&nbsp;<i class="fas fa-edit" ></i>&nbsp;</button>
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

function TextEvents() {
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
}

function accordionEvents(partial) {
    if (!partial) {
        $(".accordion_row").unbind().click(function () {
            if ($(this).hasClass("active_row_acc")) {
                $(this).next().slideUp(350)
            } else {
                $(".accordion_row.active_row_acc").next().slideUp(350)
                $(".accordion_row.active_row_acc").removeClass("active_row_acc")
                $(this).next().slideDown(350)
            }
            $(this).toggleClass("active_row_acc");
        });
    }

    $(".accordion_row .edit_row").unbind().click(function (e) {
        e.preventDefault();
        $(this).parent().find("input").removeAttr("readonly").css({ "background": "#ffffff", "color": "#000000" });
        $(this).closest(".accordion_row").next().slideDown();
        $(this).parent().unbind().click((e) => { e.preventDefault(); e.stopPropagation(); });
        let parent = $(this).closest(".accordion_row");
        $(parent).next().find(".text_area_page_editor").text("").toggle();
        $(parent).next().find(".original_html_text").empty().toggle();
    })

    $(".accordion_row .remove_acc_row").unbind().click(function (e) {
        e.preventDefault();
        ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
            $(this).parent().next().remove();
            $(this).parent().remove();
        })
    })

}

function addRowAccordion() {
    accordionEvents();
    $(".accordion_inside_panel").slideUp(350)
    $(".accordion_container").append(`
            <button class="accordion_row">
            <input value="Section" style="background:#ffffff;color:#000000;"/>
            <i class="fas fa-trash-alt remove_acc_row"></i>
            <i class="fas fa-edit edit_row"></i>
        </button>
        <div class="accordion_inside_panel" style="display: block;">
            
               <textarea class="text_area_page_editor" style="height: 10vh;"></textarea>
               <div class="original_html_text"></div>
            
        </div>
    `);
    TextEvents()
    accordionEvents(true);

}

function markRow() {
    $(".list_table tr td").css({ "background": "#ffffff" });
    $(this).addClass("active");
    $(this).find("td").css({ "background": "#ccc" });
}

function markVersionPage(){
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#preview_page").prop("disabled", true)
    }else{
        $(".page_item").removeClass("active");
        $(this).addClass("active");
        $("#preview_page").prop("disabled", false)
    }
}

function PreviewPage(){
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    window.open(`/admin/previewpage/${getPageBucket.replace("-tmp", "")}/${getPageBucket}/${getPageId}`)
}

function removePage() {
    let pageId = $(this).attr("data-id");
    let page = $(this).attr("data-page");
    let parent = $(this).closest(".connectedSortable");
    if (pageId) {
        ConformModal("אתה בטוח רוצה למחוק דף ?", () => {
            $.post("/admin/deletepage/" , {Page:page, Id:pageId})
                .then(result => {
                        $(parent).find("li[data-id='" + pageId + "']").remove()
                        Flash("נמחק בהצלחה!", "success");
                })
                .catch(err => {
                    Flash("אי אפשר למחוק דף אם הוה בתצוגה!", "error")
                })
        })
    } else {
        Flash("התרחשה שגיאה", "error")
    }
}

function SaveNewPageToServer(dataPage, bucket){
    $.ajax({
        url: "/admin/setnewpage",
        data: JSON.stringify({ DataPage: dataPage, Page: bucket }),
        type: "POST",
        contentType: "application/json",
        success: function () {
            Flash("נשמר בהצלחה!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 300)
        },
        error: function () {
            Flash("התרחשה שגיאה", "error")
        }
    })
}

function SetActiveSinglePage(id, bucket){
    $.post(`/admin/pagetoedit/setactive/${id}/${bucket}`)
    .then(res => {
        Flash("נשמר בהצלחה!", "success");
        setTimeout(() => {
            window.location.reload();
        }, 800)
    })
    .fail(err => {
        Flash("התרחשה שגיאה", "error")
    })
}

function SetActiveMultiPages(data, bucket){
    $.ajax({
        url: "/admin/pagetoedit/setactive/list",
        data: JSON.stringify({ Data: data, Page: bucket }),
        type: "POST",
        contentType: "application/json",
        success: function () {
            setTimeout(() => {
                window.location.reload();
            }, 300)
            Flash("נשמר בהצלחה!", "success")
        },
        error: function () {
            Flash("התרחשה שגיאה", "error")
        }
    })
}



$(document).ready(() => {
    setupPageEditors()
})



