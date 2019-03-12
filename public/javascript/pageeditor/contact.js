'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let contact = {
        PhoneNumber: $("#contact_phonenumber").val().trim(),
        Fax: $("#contact_fax").val().trim(),
        Email: $("#contact_email").val().trim(),
        Open: $("#contact_open").val().trim(),
        Close: $("#contact_close").val().trim()
    };

    contact.MetaData = GetMetaData();
    contact.Header = GetHeaderData();
    contact.Language = $("#language_select option:selected").val() || 0;

    contact.Accordion = Array.from($(".accordion_row")).map(item => {
        return {
            AccordionTitle: $(item).find("input").val(),
            AccordionDescription: $(item).next().find(".original_html_text").html()
        }
    })

    contact.StaticsBlocks = {};
    let flagStatics = GetStaticsFieldsBlocks(contact.StaticsBlocks);

    if (contact.MetaData && contact.Header && contact.Language && flagStatics) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(contact, prefixLanguage + "contact");
            return;
        })
    } else {
        if(!contact.Language){
            Flash('נא לבחור שפה!', 'warning');
        }else{
            Flash('לא כל השדות מלאים!', 'warning');
        }
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
    SetStaticsFieldsBlocks(template)
}


$(document).ready(() => {
    $('#contact_open, #contact_close').timepicker({
        "show2400": true,
        "timeFormat": 'HH:mm',
        "minTime": "07:00",
        "maxTime": "23:00"
    });
});

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