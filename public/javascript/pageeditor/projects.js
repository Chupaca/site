'use strict'


function saveNewPage() {
    let project = { MetaData: [] };
    project.MetaData = GetMetaData();
    project.Header = GetHeaderData();
    project.Content = GetSimpleContent();

    project.Header.PhotographerName = $("#PhotographerName").val().trim() || "";
    project.Header.PhotographerPhoneNumber = $("#PhotographerPhoneNumber").val().trim() || "";

    $(".architect_details").each((i, item) => {
        project[$(item).attr("id")] = $(item).val().trim() || ""
    })

    if (project.MetaData && project.Header && project.Content && project.ArchitectId.length) {
        ConformModal("האם אתה רוצה לשמור פרויקט חדש?", () => {
            SaveNewPageToServer(project, "projects");
            return;
        })
    } else {
        Flash('לא כל השדות מלאים!', 'warning');
        return;
    }
}



function PreviewPageProject() {
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    window.open(`/admin/previewpage/project/${getPageBucket}/${getPageId}`)
}

function publishPage() {
    let data = []
    $("#sortable li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".page_item_position").text()),
                Id: $(item).attr("data-id")
            }
        )
    })

    if (data.length > 3) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, 'projects')
        })
    } else {
        Flash("צריך לפחות פרויקט אחד!", "warning")
    }
}

function getAllArchitects() {
    $.get("/admin/architectslist")
        .then(architects => {
            if (architects && architects.length) {
                architects.forEach(item => {
                    $("#architects_select, #architects_select_search").append(`
                        <option data-name="${item.Data.Name}" data-id="${item.Id}" data-phonenumber="${item.Data.PhoneNumber}" data-email="${item.Data.Email}">${item.Data.Name}</option>
                    `)
                })
                $("#architects_select").change(changeArchitect)
                $("#architects_select_search").change(changeArchitectSearch)
            }
        })
}

function changeArchitectSearch() {
    let arId = $(this).find("option:selected").data("id");
    if (arId) {
        $(".connectedSortable li").css("display", "none");
        Array.from($(".connectedSortable li")).forEach(item => {
            if ($(item).attr("data-architectid") == arId) {
                $(item).toggle()
            }
        })
    } else {
        $(".connectedSortable li").css("display", "block");
    }
}

function checkFileToClient() {
    OpenPreviewGalleryArchitect("architects", $(this).attr("data-architectid"), (imageIds) => {
        GetImagePreviewFormatting(imageIds, "architects");
        return;
    })
}

function OpenPreviewGalleryArchitect(bucket, architectid, callback) {
    var checked_image = [];
    $.get({ url: "/admin/allimages?bucket=" + bucket + "&id=" + architectid, cache: false })
        .then(gallery => {
            $("#preview_modal_gallery").find("h2").text(bucket)
            $("#modal_preview_gallery_wrap").html(gallery)
            $("#preview_modal_gallery").css({ "display": "block", "z-index": 3000 });
            $("#modal_preview_gallery_wrap .remove_file").remove();

            $(".image_one").unbind().click(function () {
                if ($(this).hasClass("active")) {
                    checked_image.splice(checked_image.indexOf(checked_image.find(item => item.Id == $(this).attr("data-imageid"), 1)));
                } else {
                    checked_image.push({ Id: $(this).attr("data-imageid"), Link: $(this).attr("src") });
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

function changeArchitect() {
    $(".upload_btn").attr("data-architectid", $(this).find("option:selected").data("id")).prop("disabled", false)
    $(".open_gallery_clients").attr("data-architectid", $(this).find("option:selected").data("id")).prop("disabled", false)
    Object.entries($(this).find("option:selected").data()).forEach(([key, value]) => {
        $(`#Architect${key[0].toUpperCase() + key.substring(1)}`).val(value)
    })
}

$(document).ready(() => {
    setTimeout(() => {
        getAllArchitects();
        $(".open_gallery_clients").unbind().click(checkFileToClient);
        $("#preview_page").unbind().click(PreviewPageProject);
    }, 0)
})


function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    GetImagePreviewFormattingTemplate(template.Content.ContentImages.map(item => item.ImageId), template.Content.ContentImages.map(item => item.LinkToBucket), "architects");
    $(".wrap_content_page .original_html_text").html(template.Content.ContentHtml);
    $("#PhotographerName").val(template.Header.PhotographerName || "");
    $("#PhotographerPhoneNumber").val(template.Header.PhotographerPhoneNumber || '');
    $("#architects_select option[data-id='" + template.ArchitectId + "']").prop("selected", true).change();
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}