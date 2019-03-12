'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
  
    let door = {
        Title: $("#recommendedlist_title").val().trim(),
        Link: $("#recommendedlist_link").val().trim(),
        ProfileImage: $("#recommendedlist_profileimage").attr("data-bucket").trim() + "/" + $("#recommendedlist_profileimage").attr("data-imgid").trim()
    }
    let flag = true;
    Object.entries(door).forEach(([key, value]) => {
        if (!value || value.length < 2 && key != "Link") {
            $("#recommendedlist_" + key.toLowerCase()).css({ "background": "#f6b0b3" })
            flag = false;
        } else {
            $("#recommendedlist_" + key.toLowerCase()).css({ "background": "#e3f4e5" })
        }
    });
    door.Language = $("#language_select option:selected").val() || 0;
    if (flag && door.Language) {
        ConformModal("האם אתה רוצה לשמור חדש?", () => {
            SaveNewPageToServer(door, prefixLanguage + 'recommendedlist')
        })
    } else {
        if(!door.Language){
            Flash('נא לבחור שפה!', 'warning');
        }else{
            Flash('לא כל השדות מלאים!', 'warning');
        }
        return;
    }
}

function publishPage() {
    let data = []
    let prefixLanguage = $("#language_select_preview option:selected").val();
    $("#sortable li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".page_item_position").text()),
                Id: $(item).attr("data-id")
            }
        )
    })

    if (data) {
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            SetActiveMultiPages(data, prefixLanguage)
        })
    } else {
        Flash("צריך לפחות 4 לקוחות אחד!", "warning")
    }
}

function checkFileToDoor() {
    OpenPreviewGallery("recommendatedlist", (imageIds) => {
        if ((imageIds && imageIds.length > 1) || !imageIds) {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $("#recommendedlist_profileimage").attr("src", `${imageIds[0].Link}`);
            $("#recommendedlist_profileimage").attr("data-imgid", `${imageIds[0].Id}`);
            $("#recommendedlist_profileimage").attr("data-bucket", `recommendatedlist`);
        }
    })
}


$("#deactivate_block").unbind().click(() => {
    $.post(`/admin/pagetoedit/setdeactivate/block/recommendedlist`)
        .then(res => {
            Flash("נשמר בהצלחה!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 800)
        })
        .fail(err => {
            Flash("התרחשה שגיאה", "error")
        })
})


function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $("#recommendedlist_title").val(template.Title);
    $("#recommendedlist_link").val(template.Link);
    $("#recommendedlist_profileimage").attr("src", $("#LinkToBuckets").val().trim() + template.ProfileImage);
    $("#recommendedlist_profileimage").attr("data-bucket", template.ProfileImage.split("/")[0])
    $("#recommendedlist_profileimage").attr("data-imgid", template.ProfileImage.split("/")[1])
    $(".switch_wraps[data-wrap='active_version']").trigger("click");
}


//=====================

$(document).ready(() => {
    setTimeout(() => {
        $(".open_gallery_clients").unbind().click(checkFileToDoor)
        $(".remove_client_image").unbind().click(() => {
            $("#recommendedlist_profileimage").attr("src", $("#LinkToBuckets").val().trim() + "default/default_recommendedlist_door.jpg");
            $("#recommendedlist_profileimage").attr("data-imgid", "default_recommendedlist_door.jpg");
        })
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
            insertDataToRowItemVersion(["Title"])
            insertDataToRowItemVersion(["Link"], " / ")
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage(["preview_page"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}