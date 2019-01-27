'use strict'


function saveNewPage() {
    let start = {};
    start.MetaData = GetMetaData();

    if (start.MetaData) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(start, "startpage");
            return;
        })
    } else {
        Flash('לא כל השדות מלאים!', 'warning');
        return;
    }
}

function publishPage() {
    let data = [];
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
            SetActiveSinglePage(data[0].Id, "startpage");
            return;
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
        return;
    }
}

function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
    $(".remove_row_meta").unbind().click(removeMetaRow)
}