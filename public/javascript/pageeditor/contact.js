'use strict'


function saveNewPage() {
    let contact = {
        PhoneNumber: $("#contact_phonenumber").val().trim(),
        Fax: $("#contact_fax").val().trim(),
        Email: $("#contact_email").val().trim(),
        Open: $("#contact_open").val().trim(),
        Close: $("#contact_close").val().trim()
    };

    contact.MetaData = GetMetaData();
    contact.Header = GetHeaderData();


    contact.Accordion = Array.from($(".accordion_row")).map(item => {
        return {
            AccordionTitle: $(item).find("input").val(),
            AccordionDescription: $(item).next().find(".original_html_text").html()
        }
    })

    if (contact.MetaData && contact.Header) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(contact, "contact");
            return;
        })
    } else {
        Flash("לא כל השדות מיליאם!" , "warning");
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
            SetActiveSinglePage(data[0].Id, "contact");
            return
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning");
        return;
    }
}


function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click");
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    $(".accordion_container").html(BuildAccordion(template.Accordion));
    accordionEvents(false);
    $("#contact_phonenumber").val(template.PhoneNumber);
    $("#contact_fax").val(template.Fax);
    $("#contact_email").val(template.Email);
    $("#contact_open").val(template.Open);
    $("#contact_close").val(template.Close);
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}


$(document).ready(() => {
    $('#contact_open, #contact_close').timepicker({
        "show2400": true,
        "timeFormat": 'HH:mm',
        "minTime": "07:00",
        "maxTime": "23:00"
    });
});