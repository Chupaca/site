'use strict'


function saveNewPage() {
    let branch = {
        BranchName: $("#branch_branchname").val().trim(),
        PhoneNumber: $("#branch_phonenumber").val().trim(),
        Fax: $("#branch_fax").val().trim(),
        Email: $("#branch_email").val().trim(),
        City: $("#branch_city").val().trim(),
        Address: $("#branch_address").val().trim(),
        Link: $("#branch_link").val().trim(),
        Open: $("#branch_open").val().trim(),
        Close: $("#branch_close").val().trim(),
        OpenFr: $("#branch_openfr").val().trim() || null,
        CloseFr: $("#branch_closefr").val().trim() || null
    }
    const notNeeded = ["OpenFr", "CloseFr", "Link"]
    let flag = true;
    Object.entries(branch).forEach(([key, value]) => {
        if ((!value || value.length < 2) && !notNeeded.includes(key)) {
            $("#branch_" + key.toLowerCase()).css({ "background": "#f6b0b3" })
            flag = false;
        } else {
            $("#branch_" + key.toLowerCase()).css({ "background": "#e3f4e5" })
        }
    });
    if (flag) {
        ConformModal(" האם אתה רוצה לשמור סניף חדש ?", () => {
            SaveNewPageToServer(branch, 'brancheslist')
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

    if (data.length != 0) {
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            SetActiveMultiPages(data, 'brancheslist')
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
    }
}


$(document).ready(() => {
    $('#branch_open, #branch_openfr, #branch_close, #branch_closefr').timepicker({
        "show2400": true,
        "timeFormat": 'HH:mm',
        "minTime": "07:00",
        "maxTime": "23:00"
    });
});



function SetFieldsTemplate(template) {
    $('[data-wrap="active_version"] .col input').val("");
    $("#branch_branchname").val(template.BranchName);
    $("#branch_phonenumber").val(template.PhoneNumber);
    $("#branch_fax").val(template.Fax);
    $("#branch_email").val(template.Email);
    $("#branch_city").val(template.City);
    $("#branch_address").val(template.Address);
    $("#branch_link").val(template.Link);
    $("#branch_open").val(template.Open);
    $("#branch_close").val(template.Close);
    $("#branch_openfr").val(template.OpenFr);
    $("#branch_closefr").val(template.CloseFr);
    $(".switch_wraps[data-wrap='active_version']").trigger("click");

}