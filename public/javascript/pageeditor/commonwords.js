'use strict'

function publishPage() {};
function sortAndPreviewSelectedItemsByLanguage () {};
function saveNewPage() {
    let commonWords = {};
    Array.from($(".common_word_row")).forEach(item => {
        let w = $(item).find("[name='word_var']").val()
        commonWords[w] = {};
        Array.from($(item).find(".common_word")).forEach(word => {
            if($(word).val().trim() && $(word).attr("name") != 'word_var'){
                commonWords[w][$(word).attr("name")] = $(word).val().trim()
            }
        })
    });

    if (commonWords) {
        ConformModal("האם אתה רוצה לשמור גרסה ?", () => {
            $.ajax({
                url: "/admin/commonwords",
                data: JSON.stringify({ CommonWords: commonWords }),
                type: "POST",
                contentType: "application/json",
                success: function () {
                    $(".common_word_row input").prop("disabled", true)
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

function addNewWord() {
    $(".commonwords_table tbody").append(`
        <tr class="common_word_row" style="width:100%;">
           <td style="width: 19%;"><input type="text" class="common_word" name="word_var" style="direction:ltr;text-align:center;" value="" placeholder="שם שדה באנגלית" /></td>
           <td style="width: 19%;"><input type="text" class="common_word" name="/en" style="direction:ltr;text-align:center;" value="" placeholder="" /></td>
           <td style="width: 19%;"><input type="text" class="common_word" name="/he" style="direction:rtl;text-align:center;" value="" placeholder="" /></td>
           <td style="width: 19%;"><input type="text" class="common_word" name="/ru" style="direction:ltr;text-align:center;" value="" placeholder="" /></td>
           <td style="width: 19%;"><input type="text" class="common_word" name="/ar" style="direction:rtl;text-align:center;" value="" placeholder="" /></td>
           <td style="width: 5%;text-align: center;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
        </tr>
    `);
    $(".remove_row").unbind().click(removeRow)
}


function removeRow() {
    ConformModal("אתה בטוח רוצה למחוק ?", () => {
        $(this).closest(".common_word_row").remove();
    })
}



$(document).ready(() => {
    $("#add_new").unbind().click(addNewWord);
    $("#save_new").unbind().click(saveNewPage);
    $(".remove_row").unbind().click(removeRow);
});