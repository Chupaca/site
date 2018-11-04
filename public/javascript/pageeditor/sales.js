'use strict'


function saveNewPage() {
    let sale = { MetaData: [] };
    $(".meta_data_table tr").each((i, item) => {
        sale.MetaData.push(
            {
                MetaType: $(item).find(".type_meta_select option:selected").val(),
                MetaDescription: $(item).find("td:eq(1) input").val(),
            }
        )
    })

    sale.Header = {
        ImageId: $(".wrap_header_page .wrap_images_ .gallery_image").attr("data-imageid"),
        LinkToBucket: $(".wrap_header_page .wrap_images_ .gallery_image .image_one").attr("src"),
        Title: $(".wrap_header_page .title_header").val(),
        SubTitleHtml: $(".wrap_header_page .original_html_text").html()
    }

    sale.Content = {
        ContentImages: Array.from($(".wrap_content_page .wrap_images_ .image_one")).map(item => {
            return {
                ImageId: $(item).attr("data-imageid"),
                LinkToBucket: $(item).attr("src")
            }

        }),
        ContentHtml: $(".wrap_content_page .original_html_text").html()
    }

    sale.Preview = {
        ImageId: $(".wrap_preview_page .wrap_images_ .gallery_image").attr("data-imageid"),
        LinkToBucket: $(".wrap_preview_page .wrap_images_ .gallery_image .image_one").attr("src"),
        SubTitleHtml: $(".wrap_preview_page .original_html_text").html()
    }

    ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
        $.ajax({
            url: "/admin/setnewpage",
            data: JSON.stringify({ DataPage: sale, Page:"sales" }),
            type: "POST",
            contentType: "application/json",
            success: function () {
                Flash("נשמר בהצלחה!", "success")
            },
            error: function () {
                Flash("התרחשה שגיאה", "error")
            }
        })
    })
}

function publishPage() {
    let data = []
    $("#sortable li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".navigate_item_position").text()),
                Id : $(item).attr("data-id")
            }
        )
    })
   
    if (data.length == 0 || data.length == 3) {
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            $.ajax({
                url: "/admin/pagetoedit/setactive/list",
                data: JSON.stringify({ Data: data, Page:"sales" }),
                type: "POST",
                contentType: "application/json",
                success: function () {
                    Flash("נשמר בהצלחה!", "success")
                },
                error: function () {
                    Flash("התרחשה שגיאה", "error")
                }
            })
            $.post("/admin/pagetoedit/setactive/list/sales" , {})
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
    } else {
        Flash("נא לבחור גרסה!", "warning")
    }
}