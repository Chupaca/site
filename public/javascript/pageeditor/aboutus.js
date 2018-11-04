'use strict'


function saveNewPage() {
    let aboutUs = { MetaData: [] };
    $(".meta_data_table tr").each((i, item) => {
        aboutUs.MetaData.push(
            {
                MetaType: $(item).find(".type_meta_select option:selected").val(),
                MetaDescription: $(item).find("td:eq(1) input").val(),
            }
        )
    })

    aboutUs.Header = {
        ImageId: $(".wrap_header_page .wrap_images_ .gallery_image").attr("data-imageid"),
        LinkToBucket: $(".wrap_header_page .wrap_images_ .gallery_image .image_one").attr("src"),
        Title: $(".wrap_header_page .title_header").val(),
        SubTitleHtml: $(".wrap_header_page .original_html_text").html()
    }

    aboutUs.Content = {
        ContentImages: Array.from($(".wrap_content_page .wrap_images_ .image_one")).map(item => {
            return {
                ImageId: $(item).attr("data-imageid"),
                LinkToBucket: $(item).attr("src")
            }

        }),
        ContentHtml: $(".wrap_content_page .original_html_text").html()
    }

    ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
        $.ajax({
            url: "/admin/setnewpage",
            data: JSON.stringify({ DataPage: aboutUs, Page: "aboutus" }),
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
    let id = $(".list_table tr.active").attr("data-id");
    if (id) {
        ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
            $.post("/admin/pagetoedit/setactive/" + id + "/aboutus")
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