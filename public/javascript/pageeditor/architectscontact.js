'use strict'


function saveNewPage() {
    let architectsContact = { Accordion: [] };
    architectsContact.MetaData = GetMetaData();
    architectsContact.Header = GetHeaderData();
    architectsContact.Content = GetSimpleContent()

    architectsContact.Accordion = Array.from($(".accordion_row")).map(item => {
        return {
            AccordionTitle: $(item).find("input").val(),
            AccordionDescription: $(item).next().find(".original_html_text").html()
        }
    })

    if (architectsContact.MetaData && architectsContact.Header && architectsContact.Content) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(architectsContact, "architectscontact");
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
            SetActiveSinglePage(data[0].Id, "architectscontact")
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
    $(".accordion_container").html(BuildAccordion(template.Accordion))
    accordionEvents(false)
}