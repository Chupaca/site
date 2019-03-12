'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let carousel = { Desktop: {}, Mobile: {} };
    carousel.Language = $("#language_select option:selected").val() || 0;
    carousel.Desktop.Slide1 = {};
    carousel.Desktop.Slide2 = {};
    $(".DesktopDetailsSlide1").each((i, item) => {
        carousel.Desktop.Slide1[$(item).attr("name")] = $(item).val().trim() || "";
    })
    carousel.Desktop.Slide1.Theme = "headers/" || null;
    carousel.Desktop.Slide1.ThemeId = $($(".wrap_images_[data-wrap_images='desktop_theme'] .image_one")[0]).attr("data-imageid") || null;
    carousel.Desktop.Slide1.DoorImage = "doors/" || null;
    carousel.Desktop.Slide1.DoorImageId = $($(".wrap_images_[data-wrap_images='desktop_door'] .image_one")[0]).attr("data-imageid") || null;

    $(".DesktopDetailsSlide2").each((i, item) => {
        carousel.Desktop.Slide2[$(item).attr("name")] = $(item).val().trim() || "";
    })
    carousel.Desktop.Slide2.Theme = "headers/" || null;
    carousel.Desktop.Slide2.ThemeId = $($(".wrap_images_[data-wrap_images='desktop_theme'] .image_one")[1]).attr("data-imageid") || null;
    carousel.Desktop.Slide2.DoorImage = "doors/" || null;
    carousel.Desktop.Slide2.DoorImageId = $($(".wrap_images_[data-wrap_images='desktop_door'] .image_one")[1]).attr("data-imageid") || null;

    carousel.Mobile.Slide1 = {};
    carousel.Mobile.Slide2 = {};

    $(".MobileDetailsSlide1").each((i, item) => {
        carousel.Mobile.Slide1[$(item).attr("name")] = $(item).val().trim() || "";
    })
    carousel.Mobile.Slide1.Theme = "headers/" || null;
    carousel.Mobile.Slide1.ThemeId = $($(".wrap_images_[data-wrap_images='mobile_theme'] .image_one")[0]).attr("data-imageid") || null;
    carousel.Mobile.Slide1.DoorImage = "doors/" || null;
    carousel.Mobile.Slide1.DoorImageId = $($(".wrap_images_[data-wrap_images='mobile_door'] .image_one")[0]).attr("data-imageid") || null;

    $(".MobileDetailsSlide2").each((i, item) => {
        carousel.Mobile.Slide2[$(item).attr("name")] = $(item).val().trim() || "";
    })
    carousel.Mobile.Slide2.Theme = "headers/" || null;
    carousel.Mobile.Slide2.ThemeId = $($(".wrap_images_[data-wrap_images='mobile_theme'] .image_one")[1]).attr("data-imageid") || null;
    carousel.Mobile.Slide2.DoorImage = "doors/" || null;
    carousel.Mobile.Slide2.DoorImageId = $($(".wrap_images_[data-wrap_images='mobile_door'] .image_one")[1]).attr("data-imageid") || null;

    if (SanitizeAllFields(carousel, ["Language"]) && carousel.Language) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(carousel, prefixLanguage + "carousel");
        })
    } else {
        if(!carousel.Language){
            Flash('נא לבחור שפה!', 'warning');
        }else{
            Flash('לא כל השדות מלאים!', 'warning');
        }
        return;
    }
}

function publishPage() {
    let data = [];
    let prefixLanguage = $("#language_select_preview option:selected").val();
    $("#sortable li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".page_item_position").text()),
                Id: $(item).attr("data-id")
            }
        )
    })
    if (data && data.length == 1) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveSinglePage(data[0].Id, prefixLanguage)
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
    }
}


function checkImageToCarousel() {
    let bucket = $(this).attr("data-bucket");
    let wrap = $(this).attr("data-wrap");
    OpenPreviewGallery(bucket, (imageIds) => {
        GetImagePreviewFormatting(imageIds, wrap)
    })
}

function copyDetailsToMobile() {
    $(".DesktopDetailsSlide1").each((i, item) => {
        $(".MobileDetailsSlide1[name='" + $(item).attr("name") + "']").val($(item).val().trim() || "")
    })

    $(".DesktopDetailsSlide2").each((i, item) => {
        $(".MobileDetailsSlide2[name='" + $(item).attr("name") + "']").val($(item).val().trim() || "")
    })

    Flash("הועתק", "success")
}

function previewStartPage() {
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    window.open(`/admin/previewstartpage/${getPageBucket}/${getPageId}`)
}

function SetFieldsTemplate(template) {
    SetEmptyBlocks([], [".wrap_images_"])
    if (!template) {
        Flash("התרחשה שגיאה", "error")
        return;
    }
    Object.keys(template.Desktop.Slide1).forEach(item => {
        $(".DesktopDetailsSlide1[name='" + item + "']").val(template.Desktop.Slide1[item])
    })
    Object.keys(template.Desktop.Slide2).forEach(item => {
        $(".DesktopDetailsSlide2[name='" + item + "']").val(template.Desktop.Slide2[item])
    })

    Object.keys(template.Mobile.Slide1).forEach(item => {
        $(".MobileDetailsSlide1[name='" + item + "']").val(template.Mobile.Slide1[item])
    })
    Object.keys(template.Mobile.Slide2).forEach(item => {
        $(".MobileDetailsSlide2[name='" + item + "']").val(template.Mobile.Slide2[item])
    })

    GetImagePreviewFormattingTemplate([template.Desktop.Slide1.ThemeId, template.Desktop.Slide2.ThemeId], [template.Desktop.Slide1.Theme, template.Desktop.Slide2.Theme], "desktop_theme");
    GetImagePreviewFormattingTemplate([template.Mobile.Slide1.ThemeId, template.Mobile.Slide2.ThemeId], [template.Mobile.Slide1.Theme, template.Mobile.Slide2.Theme], "mobile_theme");
    GetImagePreviewFormattingTemplate([template.Desktop.Slide1.DoorImageId, template.Desktop.Slide2.DoorImageId], [template.Desktop.Slide1.DoorImage, template.Desktop.Slide2.DoorImage], "desktop_door");
    GetImagePreviewFormattingTemplate([template.Mobile.Slide1.DoorImageId, template.Mobile.Slide2.DoorImageId], [template.Mobile.Slide1.DoorImage, template.Mobile.Slide2.DoorImage], "mobile_door");

    $(".switch_wraps[data-wrap='header']").trigger("click");
}

$(document).ready(() => {
    setTimeout(() => {
        $(".open_gallery_carousel").unbind().click(checkImageToCarousel);
        $(".copy_to_mobile").unbind().click(copyDetailsToMobile);
        $("#preview_start_page").unbind().click(previewStartPage);
    }, 0)
})


function sortAndPreviewSelectedItemsByLanguage() {
    $.get(`/admin/versionsbylanguage/${$(this).val()}/${$(this).attr('data-type')}`)
        .then(html => {
            $("#vertion_wrap").html(html)
            $("#template_page").unbind().click(getTemplatePage);
            $("#publish_page").unbind().click(publishPage);
            $("#sortable, #sortable_tmp").sortable({
                connectWith: ".connectedSortable",
                stop: () => { sortNavItemsAfterChange() }
            }).disableSelection();
            sortNavItemsAfterChange()
            mouseOverRowVersion()
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}