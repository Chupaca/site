'use strict'


function saveRedirect() {
    let redirects = {}
    redirects.Links = Array.from($(".old_links_row")).map(item => {
        let links = {
            From: $(item).find("td input.From").val().trim(),
            To: $(item).find("td input.To").val().trim()
        };
        return links;
    });

    if (redirects.Links) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            $.ajax({
                url: "/admin/saveredirects",
                data: JSON.stringify({ Redirects: redirects }),
                type: "POST",
                contentType: "application/json",
                success: function () {
                    $(".old_links_row input").prop("disabled", true)
                    Flash("נשמר בהצלחה!", "success")
                },
                error: function () {
                    Flash("התרחשה שגיאה", "error")
                }
            })
        })
    } else {
        Flash("צריך לפחות לינק 1!", "warning")
    }
}

function addNewOldLink() {
    $(".old_links_table tbody").append(`
        <tr class="old_links_row" style="width:100%;">
        <td style="width: 40%;"><b>pandoor.co.il/</b><input type="text" class="From" value="" placeholder="כתובת ישן"></td>
        <td style="width: 40%;"><b>pandoor.co.il/</b><input type="text" class="To" value="" placeholder="כתובת חדש"></td>
        <td style="width: 10%;text-align: center;"><i class="fas fa-trash-alt remove_row_old_links" style="color:red;cursor:pointer;"></i></td>
        </tr>
    `);
    $(".remove_row_old_links").unbind().click(removeOldLink)
}


function removeOldLink() {
    ConformModal("אתה בטוח רוצה למחוק ?", () => {
        $(this).closest(".old_links_row").remove();
    })
}



$(document).ready(() => {
    $("#add_new_old_links").unbind().click(addNewOldLink);
    $("#save_new_redirects").unbind().click(saveRedirect);
    $(".remove_row_old_links").unbind().click(removeOldLink);
});