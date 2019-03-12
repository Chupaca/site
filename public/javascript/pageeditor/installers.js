'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
   
    let installer = { 
        Name: $("#installer_name").val().trim(),
        PhoneNumber : $("#installer_phone").val().trim(),
        Location : $("#location option:selected").val(),
        LocationHe : $("#location option:selected").text().trim()
    }
    installer.Language = $("#language_select option:selected").val() || 0;

    if (installer.Name.length > 3 && installer.PhoneNumber.length > 8 && installer.Location.length > 2 && installer.Language) {
        ConformModal("האם אתה רוצה לשמור מתקין חדש?", () => {
            SaveNewPageToServer(installer, prefixLanguage + 'installers')
        })
    } else {
        if(!installer.Language){
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

    if (data.length != 0 ) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, prefixLanguage);
            return;
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
        return;
    }
}



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
            insertDataToRowItemVersion(["PhoneNumber"], " | ")
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage(['template_page', "preview_page", "deactivate_block"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}