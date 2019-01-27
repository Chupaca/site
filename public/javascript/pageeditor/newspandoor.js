'use strict'


function saveNewPage() {
    let news = { NewsText: $("#news_text").val().trim() }
    if (news.length < 10) {
        Flash("אי אפשר לשמור חדשות פחות מ 10 אותיות!", "warning")
    } else {
        ConformModal("אתה בטוח רוצה לשמור חדשות ?", () => {
            SaveNewPageToServer(news, 'newspandoor')
        })
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

    if (data.length == 0 || data.length < 5) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, 'newspandoor')
        })
    } else {
        Flash("נא לבחור גרסה!", "warning")
    }
}


$("#deactivate_block").unbind().click(()=>{
    $.post(`/admin/pagetoedit/setdeactivate/block/newspandoor`)
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


function SetFieldsTemplate(template) {
  $("#news_text").text(template.NewsText);
  $(".switch_wraps[data-wrap='active_version']").trigger("click");
}

$(document).ready(() => {
    $(".title_news_versions").unbind().mouseover(function () {
        $(this).css({ "white-space": "unset" })
    })
        .mouseleave(function () {
            $(this).css({ "white-space": "nowrap" })
        });
})