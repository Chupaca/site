'use strict'

function saveNewPage(){};
function publishPage(){};

function setNotActive() {
    let row = this;
    let id = $(this).attr("data-id");
    let bucket = $(this).attr("data-bucket");
    let active = $(this).attr("data-active");
    if (active)
        $.post(`/admin/incomingrequest/notactive/${id}/${bucket}`)
            .then(() => {
                $(row).removeAttr("data-active");
                $(row).find(".flashing_sos").removeClass("flashing_sos");
                getNotifications();
            })
}

function removeMail() {
    let pageId = $(this).closest(".accordion_row").attr("data-id");
    let bucket = $(this).closest(".accordion_row").attr("data-bucket");
    if (pageId && bucket) {
        ConformModal("אתה בטוח רוצה למחוק מייל ?", () => {
            $.post("/admin/deletepage/", { Page: bucket, Id: pageId })
                .then(() => {
                    $(this).parent().next().remove();
                    $(this).parent().remove();
                    Flash("נמחק בהצלחה!", "success");
                })
                .catch(err => {
                    Flash("התרחשה שגיאה", "error")
                })
        })
    } else {
        Flash("התרחשה שגיאה", "error")
    }
}

$(document).ready(() => {
    setTimeout(() => {
        $(".accordion_row").click(setNotActive);
        $(".remove_acc_row").unbind().click(removeMail);
    }, 0)
})