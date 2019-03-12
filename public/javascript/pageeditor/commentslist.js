'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
   
    let client = {
        Name: $("#client_name").val().trim(),
        City: $("#client_city").val().trim(),
        Comment: $("#client_comment").val().trim(),
        Email: $("#client_email").val().trim(),
        PhoneNumber: $("#client_phonenumber").val().trim(),
        ProfileImage: ($("#client_profileimage").attr("data-imgid") == 'default_client_comments_icon.png' ? "default/" : "clients/") + $("#client_profileimage").attr("data-imgid").trim()
    }
    client.Language = $("#language_select option:selected").val() || 0;

    if (SanitizeAllFields(client, ["PhoneNumber", "Email", "ProfileImage", "Language"]) && client.Language) {
        ConformModal("האם אתה רוצה לשמור לקוח חדש?", () => {
            SaveNewPageToServer(client, prefixLanguage + 'commentslist')
        })
    } else {
        if(!client.Language){
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

    if (data.length > 3) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SetActiveMultiPages(data, prefixLanguage)
        })
    } else {
        Flash("ניתן לפרסם ללא פחות מ-4 לקוחות!", "warning")
    }
}

function checkFileToClient() {
    OpenPreviewGallery("clients", (imageIds) => {
        if (imageIds && imageIds.length > 1) {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $("#client_profileimage").attr("src", imageIds[0].Link);
            $("#client_profileimage").attr("data-imgid", imageIds[0].Id);
        }
    })
}


function SetFieldsTemplate(template) {
    $(".remove_client_image").trigger("click");
    $("#client_name").val(template.Name)
    $("#client_city").val(template.City)
    $("#client_comment").val(template.Comment)
    $("#client_email").val(template.Email)
    $("#client_phonenumber").val(template.PhoneNumber || "0")
    $("#client_profileimage").attr("src", template.ProfileImage ? $("#LinkToBuckets").val().trim() + template.ProfileImage : $("#LinkToBuckets").val().trim() + "default/default_client_comments_icon.png")
    $(".switch_wraps[data-wrap='active_version']").trigger("click");
}

//=====================

$(document).ready(() => {
    setTimeout(() => {
        $("#add_new_news").unbind().click(() => { $("#news_text").val("") });
        $(".open_gallery_clients").unbind().click(checkFileToClient)
        $(".remove_client_image").unbind().click(() => {
            $("#client_profileimage").attr("src", $("#LinkToBuckets").val().trim() + "default/default_client_comments_icon.png");
            $("#client_profileimage").attr("data-imgid", "default_client_comments_icon.png");
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
            insertDataToRowItemVersion(["Name"])
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage(["preview_page", "deactivate_block"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}