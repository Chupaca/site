'use strict'


function saveNewPage() {
    let architectsContact = { MetaData: [], Accordion: [] };
    $(".meta_data_table tr").each((i, item) => {
        architectsContact.MetaData.push(
            {
                MetaType: $(item).find(".type_meta_select option:selected").val(),
                MetaDescription: $(item).find("td:eq(1) input").val(),
            }
        )
    })

    architectsContact.Header = {
        ImageId: $(".wrap_header_page .wrap_images_ .gallery_image").attr("data-imageid"),
        LinkToBucket: $(".wrap_header_page .wrap_images_ .gallery_image .image_one").attr("src"),
        Title: $(".wrap_header_page .title_header").val(),
        SubTitleHtml: $(".wrap_header_page .original_html_text").html()
    }

    architectsContact.Content = {
        ContentImages: Array.from($(".wrap_content_page .wrap_images_ .image_one")).map(item => {
            return {
                ImageId: $(item).attr("data-imageid"),
                LinkToBucket: $(item).attr("src")
            }

        }),
        ContentHtml: $(".wrap_content_page .original_html_text").html()
    }
    architectsContact.Accordion = Array.from($(".accordion_row")).map(item => {
        return {
            AccordionTitle: $(item).find("input").val(),
            AccordionDescription: $(item).next().find(".original_html_text").html()
        }
    })


    ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
        SaveNewPageToServer(architectsContact, "architectscontact");
    })
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
        ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
            SetActiveSinglePage(data[0].Id, "architectscontact")
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
    }
}