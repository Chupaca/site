'use strict'


function saveNewPage() {
    let blog = {};
    blog.MetaData = GetMetaData();
    blog.Header = GetHeaderData();
    blog.Content = GetSimpleContent()

    blog.Preview = {
        ImageId: $(".wrap_preview_page .wrap_images_ .image_one").attr("data-imageid"),
        LinkToBucket: "generals/",
        Date: $(".wrap_preview_page #datepicker").val(),
        SubTitleHtml: $(".wrap_preview_page .original_html_text").html()
    }
    if (blog.MetaData && blog.Header && blog.Content && blog.Preview.LinkToBucket && blog.Preview.Date && blog.Preview.SubTitleHtml) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(blog, 'blogslist');
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

    if (data.length > 1) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, 'blogslist')
        })
    } else {
        Flash("נא לבחור גרסה!", "warning")
    }
}


$("#datepicker").datepicker({
    dateFormat: "dd/mm/yy",
    dayNamesMin: ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
    monthNames: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"]
})


function SetFieldsTemplate(template) {
    SetEmptyBlocks(["#datepicker"])
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    GetImagePreviewFormattingTemplate(template.Content.ContentImages.map(item => item.ImageId), template.Content.ContentImages.map(item => item.LinkToBucket), "blogs");
    $(".wrap_content_page .original_html_text").html(template.Content.ContentHtml);
    $(".wrap_preview_page .original_html_text").html(template.Preview.SubTitleHtml);
    $("#datepicker").val(template.Preview.Date);
    GetImagePreviewFormattingTemplate([template.Preview.ImageId], [template.Preview.LinkToBucket], "generals");
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
    
}