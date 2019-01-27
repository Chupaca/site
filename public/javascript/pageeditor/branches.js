'use strict'


function saveNewPage() {
    let branch = {};
    branch.MetaData = GetMetaData();
    branch.Header = GetHeaderData();

    branch.ExternalBranches = Array.from($(".ex_branch_row")).map(item => {
        let exB = {};
        $(item).find("td input").each((i , inp) => {
            exB[$(inp).attr('class')] = $(inp).val().trim();
            return
        })
        exB.Location = $(item).find(".ex_branch_select option:selected").val();
        exB.LocationHe = $(item).find(".ex_branch_select option:selected").text().trim();
        return exB;
    });

    if(branch.MetaData && branch.Header){
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(branch, "branches");
            return;
        })
    }else{
        Flash("לא כל השדות מיליאם!" , "warning");
        return;
    }
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
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveSinglePage(data[0].Id, "branches");
            return;
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
        return;
    }
}

function removeExternalBranch() {
    ConformModal("אתה בטוח רוצה למחוק ?", () => {
        $(this).closest(".ex_branch_row").remove();
    })
}

function addNewExternalBranch() {
    $(".external_branches_table tbody").append(`
    <tr class="ex_branch_row" style="width:100%;">
    <td style="width: 10%;">
      <select class="ex_branch_select">
            <option value="North" selected>איזור הצפון</option>
            <option value="Sharon">איזור השרון</option>
            <option value="Jerusalem">איזור ירושלים</option>
            <option value="Center">איזור מרכז</option>
            <option value="Shfela">איזור השפלה</option>
            <option value="South">איזור דרום</option>
      </select>
    </td>
    <td style="width: 15%;"><input type="text" class="BranchName" value="" placeholder="שם סוכן"></td>
    <td style="width: 15%;"><input type="text" class="City" value="" placeholder="עיר"></td>
    <td style="width: 20%;"><input type="text" class="Address" value="" placeholder="כתובת"></td>
    <td style="width: 15%;"><input type="text" class="PhoneNumber" value="" placeholder="טל:"></td>
    <td style="width: 15%;"><input type="text" class="Email" value="" placeholder="אימייל"></td>
    <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_external_branch" style="color:red;cursor:pointer;"></i></td>
    </tr>
    `);
    $(".remove_row_external_branch").unbind().click(removeExternalBranch)
}



function SetFieldsTemplate(template) {
    SetEmptyBlocks([], [".external_branches_table tbody"])
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    $(".external_branches_table tbody").html(BuildExternalBranch(template.ExternalBranches));
    $(".remove_row_external_branch").unbind().click(removeExternalBranch);
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}



$(document).ready(() => {
    $("#add_new_external_branch").unbind().click(addNewExternalBranch);
});