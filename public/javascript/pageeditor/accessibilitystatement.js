'use strict'


function saveNewPage() {
    let accessibilityStatement = {};
    accessibilityStatement.MetaData = GetMetaData();
    accessibilityStatement.Header = GetHeaderData();
    accessibilityStatement.Content = GetSimpleContent()

    if (accessibilityStatement.MetaData && accessibilityStatement.Header && accessibilityStatement.Content) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(accessibilityStatement, "accessibilitystatement");
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
            SetActiveSinglePage(data[0].Id, "accessibilitystatement")
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
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
    GetImagePreviewFormattingTemplate(template.Content.ContentImages.map(item => item.ImageId), template.Content.ContentImages.map(item => item.LinkToBucket), "generals");
    $(".wrap_content_page .original_html_text").html(template.Content.ContentHtml);
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}