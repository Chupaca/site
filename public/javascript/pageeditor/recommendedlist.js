'use strict'


function saveNewPage() {
    let door = {
        Title: $("#recommendedlist_title").val().trim(),
        Link: $("#recommendedlist_link").val().trim(),
        ProfileImage: $("#recommendedlist_profileimage").attr("data-bucket").trim() + "/" + $("#recommendedlist_profileimage").attr("data-imgid").trim()
    }
    let flag = true;
    Object.entries(door).forEach(([key, value]) => {
        if (!value || value.length < 2 && key != "Link") {
            $("#recommendedlist_" + key.toLowerCase()).css({ "background": "#f6b0b3" })
            flag = false;
        } else {
            $("#recommendedlist_" + key.toLowerCase()).css({ "background": "#e3f4e5" })
        }
    });

    if (flag) {
        ConformModal("האם אתה רוצה לשמור חדש?", () => {
            SaveNewPageToServer(door, 'recommendedlist')
        })
    } else {
        Flash("לא כל השדות של לקוח מלאים", "warning")

    }
}

function publishPage() {
    let data = []
    $("#sortable li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".page_item_position").text()),
                Id: $(item).attr("data-id")
            }
        )
    })

    if (data) {
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            SetActiveMultiPages(data, 'recommendedlist')
        })
    } else {
        Flash("צריך לפחות 4 לקוחות אחד!", "warning")
    }
}

function checkFileToDoor() {
    OpenPreviewGallery("recommendatedlist", (imageIds) => {
        if ((imageIds && imageIds.length > 1) || !imageIds) {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $("#recommendedlist_profileimage").attr("src", `${imageIds[0].Link}`);
            $("#recommendedlist_profileimage").attr("data-imgid", `${imageIds[0].Id}`);
            $("#recommendedlist_profileimage").attr("data-bucket", `recommendatedlist`);
        }
    })
}


$("#deactivate_block").unbind().click(() => {
    $.post(`/admin/pagetoedit/setdeactivate/block/recommendedlist`)
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

//=====================

$(document).ready(() => {
    setTimeout(() => {
        $(".open_gallery_clients").unbind().click(checkFileToDoor)
        $(".remove_client_image").unbind().click(() => {
            $("#recommendedlist_profileimage").attr("src", $("#LinkToBuckets").val().trim() + "default/default_recommendedlist_door.jpg");
            $("#recommendedlist_profileimage").attr("data-imgid", "default_recommendedlist_door.jpg");
        })
    }, 0)
})