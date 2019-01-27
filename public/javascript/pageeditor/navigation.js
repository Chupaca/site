'use strict'


function saveNewPage() {
    let nav = { 
        Title: $("#nav_title").val().trim(),
        Link : $("#nav_link").val().trim(),
    }

    if (nav.Title.length > 2 ) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(nav, 'navigation')
        })
    } else {
        Flash("לא כל השדות של מלאים", "warning")
       
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

    if (data.length != 0 ) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, 'navigation')
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
    }
}
