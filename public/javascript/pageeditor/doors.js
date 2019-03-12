'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
   
    let doorPage = {};
    doorPage.MetaData = GetMetaData();
    doorPage.Header = GetHeaderData();
    doorPage.Collection = $("#select_collection option:selected").val().trim()
    doorPage.Language = $("#language_select option:selected").val() || 0;

    doorPage.StaticsBlocks = {};
    let flagStatics = GetStaticsFieldsBlocks(doorPage.StaticsBlocks);

    if (doorPage.MetaData && doorPage.Header && doorPage.Collection && doorPage.Language) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(doorPage, prefixLanguage + "doors");
            return;
        })
    } else {
        if(!doorPage.Language){
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

    if (data.length != 0) {
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            SetActiveMultiPages(data, prefixLanguage)
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
    }
}

function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml); 
    $("#select_collection option[value='" + template.Collection + "']").prop("selected", true).change();
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
    SetStaticsFieldsBlocks(template)
}



function getAllCollections() {
    $.get("/admin/collectionslist")
        .then(collections => {
            if (collections && collections.length) {
                collections.forEach(item => {
                    $("#select_collection").append(`
                        <option value="${item.Id}" >${item.Data.CollectionName}</option>
                    `)
                })
            }
        })
}

$(document).ready(() => {
    setTimeout(() => {
        getAllCollections();
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
            insertDataToRowItemVersion(["Header", "Title"])
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage(["deactivate_block"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}