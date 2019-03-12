'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
  
    let sale = {};
    sale.MetaData = GetMetaData();
    sale.Header = GetHeaderData();
    sale.Content = GetSimpleContent()
    sale.StaticsBlocks = {};
    sale.Preview = {
        ImageId: $(".wrap_preview_page .wrap_images_ .image_one").attr("data-imageid"),
        LinkToBucket: "generals/",
        SubTitleHtml: $(".wrap_preview_page .original_html_text").html()
    }
    sale.Language = $("#language_select option:selected").val() || 0;
    let flagStatics = GetStaticsFieldsBlocks(sale.StaticsBlocks);

    if (sale.MetaData && sale.Header && sale.Content && sale.Preview.LinkToBucket && sale.Preview.SubTitleHtml && sale.Language && flagStatics) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(sale, prefixLanguage + 'sales')
        })
    } else {
        if(!sale.Language){
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

    if (data.length == 0 || data.length == 3) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, prefixLanguage)
        })
    } else {
        Flash("נא לבחור גרסה!", "warning")
    }
}

$("#deactivate_block").unbind().click(()=>{
    $.post(`/admin/pagetoedit/setdeactivate/block/sales`)
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
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    GetImagePreviewFormattingTemplate(template.Content.ContentImages.map(item => item.ImageId), template.Content.ContentImages.map(item => item.LinkToBucket), "sales");
    $(".wrap_content_page .original_html_text").html(template.Content.ContentHtml);
    $(".wrap_preview_page .original_html_text").html(template.Preview.SubTitleHtml);
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
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}