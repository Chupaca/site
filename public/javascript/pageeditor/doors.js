'use strict'


function saveNewPage() {
    let doorPage = {};
    doorPage.MetaData = GetMetaData();
    doorPage.Header = GetHeaderData();
    doorPage.Collection = $("#select_collection option:selected").val().trim()

    if (doorPage.MetaData && doorPage.Header && doorPage.Collection) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(doorPage, "doors");
            return;
        })
    } else {
        Flash('לא כל השדות מלאים!', 'warning');
        return;
    }
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

    if (data.length != 0) {
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            SetActiveMultiPages(data, 'doors')
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