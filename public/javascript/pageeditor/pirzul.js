
'use strict'

function saveNewPage() {
    let collection = { Pirzul: [] }
    Array.from($(".pirzul_row")).forEach(pirzul => {
        collection.Pirzul.push({
            Description: $(pirzul).find(".PirzulDescription").val().trim(),
            DoorImage: "pirzulcollection/" + $(pirzul).find(".sub_model_pirzul_wrap").attr("data-imgid").trim(),
            DoorImageId: $(pirzul).find(".sub_model_pirzul_wrap").attr("data-imgid").trim()
        })
    })
    if (collection && collection.Pirzul && collection.Pirzul.length) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(collection, "pirzul");
            return;
        })
    } else {
        Flash('לא כל השדות מלאים!', 'warning');
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
            SetActiveSinglePage(data[0].Id, "pirzul");
            return;
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
        return;
    }
}

function addNewPirzul(e, pirzuls) {
    let html = '';
    if (pirzuls) {
        pirzuls.forEach(pirzul => {
            html += `<tr  class="pirzul_row" style="width:100%;">
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="PirzulDescription" value="${pirzul.Description}" placeholder="שם פרזול" ></td>
            <td style="width: 7%;"><img style="width:40%;" class="sub_model_pirzul_wrap" data-imgid="${pirzul.DoorImageId}"  src="${$("#LinkToBuckets").val().trim() + pirzul.DoorImage}"  /></td>
            <td style="width: 7%;">
                <i class="far fa-image image_pirzul" style="cursor:pointer;font-size:3vh;" title="תמונת דלת"></i>
                <i class="fas fa-cloud-upload-alt upload_pirzul" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="pirzulcollection" title="הוספת תמונות" ></i>
            </td>
                <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
            </tr>`
        })
    } else {
        html += `<tr  class="pirzul_row" style="width:100%;">

            <td style="width: 48%;"><input style="width: 96%;" type="text" class="PirzulDescription" value="" placeholder="שם פרזול" ></td>
            <td style="width: 7%;"><img style="display:none;" class="sub_model_pirzul_wrap" /></td>
            <td style="width: 7%;">
                <i class="far fa-image image_pirzul" style="cursor:pointer;font-size:3vh;" title="תמונת דלת"></i>
                <i class="fas fa-cloud-upload-alt upload_btn" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="pirzulcollection" title="הוספת תמונות" ></i>
            </td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
        </tr>`
    }

    $(".doors_table tbody").append(html)
    $(".upload_btn").unbind().click(UploadFiles)
    $(".image_pirzul").unbind().click(checkFileTo)
    sortItems("pirzul_row")
    $(".remove_row").unbind().click(removeRow)

}

function checkFileTo() {
    let parent_row = $(this).closest(".pirzul_row");
    OpenPreviewGallery('pirzulcollection', (imageIds) => {
        if (imageIds && imageIds.length > 1 && bucket == "headers") {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $(parent_row).find(".sub_model_pirzul_wrap").attr("src", imageIds[0].Link);
            $(parent_row).find(".sub_model_pirzul_wrap").attr("data-imgid", imageIds[0].Id);
            $(parent_row).find(".sub_model_pirzul_wrap").css({ "width": "40%" });
            $(parent_row).find(".sub_model_pirzul_wrap").show(30);
        }
    })
}


function sortItems(classItems) {
    $("." + classItems).each((i, item) => {
        $(item).find(".Position").val(i + 1)
    })
}

function removeRow() {
    $(this).closest("tr").remove();
}

function SetFieldsTemplate(template) {
    addNewPirzul(null, template.Pirzul)
    $(".switch_wraps[data-wrap='pirzul_collection']").trigger("click");
}

$(document).ready(() => {
    setTimeout(() => {
        $("#add_new_pirzul").unbind().click(addNewPirzul);
        $(".remove_row").unbind().click(removeRow)
    }, 0);
})