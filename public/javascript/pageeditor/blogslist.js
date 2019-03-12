'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
   
    let blog = {};
    blog.MetaData = GetMetaData();
    blog.Header = GetHeaderData();
    blog.Content = GetSimpleContent()
    blog.Language = $("#language_select option:selected").val() || 0;

    blog.Preview = {
        ImageId: $(".wrap_preview_page .wrap_images_ .image_one").attr("data-imageid"),
        LinkToBucket: "generals/",
        Date: $(".wrap_preview_page #datepicker").val(),
        SubTitleHtml: $(".wrap_preview_page .original_html_text").html()
    }
    blog.StaticsBlocks = {};
    let flagStatics = GetStaticsFieldsBlocks(blog.StaticsBlocks);

    if (blog.MetaData && blog.Header && blog.Content && blog.Preview.LinkToBucket && blog.Preview.Date && blog.Preview.SubTitleHtml && blog.Language && flagStatics) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(blog, prefixLanguage + 'blogslist');
            return;
        })
    } else {
        if(!blog.Language){
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

    if (data.length > 1) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, prefixLanguage)
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
            insertDataToRowItemVersion(["Header", "Title"])
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage([ "deactivate_block"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}