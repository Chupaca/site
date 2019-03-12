'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let start = {};
    start.MetaData = GetMetaData();
    start.StaticsBlocks = {};
    start.Language = $("#language_select option:selected").val() || 0;

    let flagStatics = GetStaticsFieldsBlocks(start.StaticsBlocks);

    if (start.MetaData && start.Language && flagStatics) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(start, prefixLanguage + "startpage");
            return;
        })
    } else {
        if (!start.Language) {
            Flash('נא לבחור שפה!', 'warning');
        } else {
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
            SetActiveSinglePage(data[0].Id, prefixLanguage);
            return;
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
        return;
    }
}


function SetFieldsTemplate(template) {
    SetEmptyBlocks([".static_blocks"])
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
    $(".remove_row_meta").unbind().click(removeMetaRow);
    SetStaticsFieldsBlocks(template)
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
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage(["preview_page", "deactivate_block"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}