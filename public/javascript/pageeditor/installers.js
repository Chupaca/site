'use strict'


function saveNewPage() {
    let installer = { 
        Name: $("#installer_name").val().trim(),
        PhoneNumber : $("#installer_phone").val().trim(),
        Location : $("#location option:selected").val(),
        LocationHe : $("#location option:selected").text().trim()
    }

    if (installer.Name.length > 3 && installer.PhoneNumber.length > 8 && installer.Location.length > 2) {
        ConformModal("האם אתה רוצה לשמור מתקין חדש?", () => {
            SaveNewPageToServer(installer, 'installers')
        })
    } else {
        Flash("לא כל השדות של מתקין מלאים", "warning")
       
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
            SetActiveMultiPages(data, 'installers');
            return;
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
        return;
    }
}
