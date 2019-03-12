'use strict'

const locationsSanitize = {
    North : {
        'en' : 'Northern Region',
        'he' : 'איזור הצפון',
        'ru' : 'Северный округ',
        'ar' : 'المنطقة الشمالية',
    },
    Sharon : {
        'en' : 'Sharon Area',
        'he' : 'איזור השרון',
        'ru' : 'Округ Шарон',
        'ar' : 'منطقة شارون',
    },
    Jerusalem : {
        'en' : 'Jerusalem Region',
        'he' : 'איזור ירושלים',
        'ru' : 'Иерусалимский округ',
        'ar' : 'منطقة القدس',
    },
    Center : {
        'en' : 'Central Region',
        'he' : 'איזור מרכז',
        'ru' : 'Центральный регион',
        'ar' : 'المنطقة الوسطى',
    },
    Shfela : {
        'en' : 'HaShfela Region',
        'he' : 'אזור השפלה',
        'ru' : 'Ха-Шфела регион',
        'ar' : 'منطقة شفيلا',
    },
    South : {
        'en' : 'Southern Region',
        'he' : 'איזור הדרום',
        'ru' : 'Южный регион',
        'ar' : 'المنطقة الجنوبية',
    }
}
function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let branch = {};
    branch.MetaData = GetMetaData();
    branch.Header = GetHeaderData();
    branch.Language = $("#language_select option:selected").val() || 0;

    branch.ExternalBranches = Array.from($(".ex_branch_row")).map(item => {
        let exB = {};
        $(item).find("td input").each((i , inp) => {
            exB[$(inp).attr('class')] = $(inp).val().trim();
            return
        })
        exB.Location = $(item).find(".ex_branch_select option:selected").val();
        exB.LocationHe = locationsSanitize[exB.Location][branch.Language];
        return exB;
    });

    
    branch.StaticsBlocks = {};
    let flagStatics = GetStaticsFieldsBlocks(branch.StaticsBlocks);

    if(branch.MetaData && branch.Header && branch.Language && flagStatics){
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(branch, prefixLanguage + "branches");
            return;
        })
    }else{
        if(!branch.Language){
            Flash('נא לבחור שפה!', 'warning');
        }else{
            Flash('לא כל השדות מלאים!', 'warning');
        }
        return;
    }
}


function publishPage() {
    let data = [];
    let prefixLanguage = $("#language_select_preview option:selected").val();
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
            SetActiveSinglePage(data[0].Id, prefixLanguage);
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
    SetStaticsFieldsBlocks(template)
}



$(document).ready(() => {
    $("#add_new_external_branch").unbind().click(addNewExternalBranch);
});


function sortAndPreviewSelectedItemsByLanguage() {
    $.get(`/admin/versionsbylanguage/${$(this).val()}/${$(this).attr('data-type')}`)
        .then(html => {
            $("#vertion_wrap").html(html)
            $("#template_page").unbind().click(getTemplatePage);
            $("#publish_page").unbind().click(publishPage);
            $("#sortable, #sortable_tmp").sortable({
                connectWith: ".connectedSortable",
                stop: () => { sortNavItemsAfterChange() }
            }).disableSelection();
            sortNavItemsAfterChange()
            insertDataToRowItemVersion(["Header", "Title"])
            mouseOverRowVersion()
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}