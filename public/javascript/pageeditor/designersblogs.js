'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let blogs = {};
    blogs.MetaData = GetMetaData();
    blogs.Header = {
        ImageId: $(".wrap_header_page .wrap_images_.desktop .image_one").attr("data-imageid"),
        LinkToBucket: $(".wrap_header_page .wrap_images_.desktop").attr("data-wrap_images") + "/",
        MobileLinkToBucket: $(".wrap_header_page .wrap_images_.mobile").attr("data-wrap_images") + "/",
        MobileImageId: $(".wrap_header_page .wrap_images_.mobile .image_one").attr("data-imageid"),
    }
    blogs.StaticsBlocks = {};
    let flagStatics = GetStaticsFieldsBlocks(blogs.StaticsBlocks);

    if (blogs.MetaData && blogs.Header && flagStatics) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(blogs, prefixLanguage + "designersblogs");
            return;
        })
    } else {
        Flash('לא כל השדות מלאים!', 'warning');
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

$(document).ready(() => {
    setTimeout(() => {}, 0)
})

function PreviewPage() {
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    window.open(`/admin/previewpage/${getPageBucket.replace("-tmp", "")}/${getPageBucket}/${getPageId}`)
}

function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    GetImagePreviewFormattingTemplate([template.Header.MobileImageId], [template.Header.MobileLinkToBucket], "headers_mobile");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
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