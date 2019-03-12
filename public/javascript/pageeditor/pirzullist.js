'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let pirzullist = {}
    pirzullist.MetaData = GetMetaData();
    pirzullist.Header = GetHeaderData();
    pirzullist.Pirzul = [];

    Array.from($(".pirzul_row")).forEach(pirzul => {
        pirzullist.Pirzul.push({
            Position : $(pirzul).find(".Position").val().trim(),
            Description: $(pirzul).find(".PirzulDescription").val().trim(),
            DoorImage: "pirzulcollection/" + $(pirzul).find(".sub_model_pirzul_wrap").attr("data-imgid").trim(),
            DoorImageId: $(pirzul).find(".sub_model_pirzul_wrap").attr("data-imgid").trim()
        })
    })

    pirzullist.Language = $("#language_select option:selected").val() || 0;

    if (pirzullist.MetaData && pirzullist.Header && pirzullist.Pirzul.length && pirzullist.Language) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(pirzullist, prefixLanguage + "pirzullist");
        })
    } else {
        if(!pirzullist.Language){
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
            SetActiveSinglePage(data[0].Id, prefixLanguage)
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
    }
}

function addNewPirzul(e, pirzuls) {
    let html = '';
    if (pirzuls) {
        pirzuls.forEach(pirzul => {
            html += `<tr  class="pirzul_row" style="width:100%;">
            <td style="width: 5%;"><input type="text" class="Position" value="${$(".pixel_row").length + 1}" style="padding:1vh 1vh;" readonly></td>
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="PirzulDescription" value="${pirzul.Description}" placeholder="שם פרזול" ></td>
            <td style="width: 7%;"><img style="width:40%;" class="sub_model_pirzul_wrap" data-imgid="${pirzul.DoorImageId}"  src="${$("#LinkToBuckets").val().trim() + pirzul.DoorImage}"  /></td>
            <td style="width: 7%;">
                <i class="far fa-image image_pirzul" style="cursor:pointer;font-size:3vh;" title="תמונת דלת" data-bucket="pirzulcollection" ></i>
                <i class="fas fa-cloud-upload-alt upload_pirzul" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="pirzulcollection" title="הוספת תמונות" ></i>
            </td>
                <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;float: left;
                margin-left: 2vh;"></i></td>
            </tr>`
        })
    } else {
        html += `<tr  class="pirzul_row" style="width:100%;">
            <td style="width: 5%;"><input type="text" class="Position" value="${$(".pixel_row").length + 1}" style="padding:1vh 1vh;" readonly></td>
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="PirzulDescription" value="" placeholder="שם פרזול" ></td>
            <td style="width: 7%;"><img style="display:none;" class="sub_model_pirzul_wrap" /></td>
            <td style="width: 7%;">
                <i class="far fa-image image_pirzul" style="cursor:pointer;font-size:3vh;" title="תמונת דלת" data-bucket="pirzulcollection"></i>
                <i class="fas fa-cloud-upload-alt upload_btn" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="pirzulcollection" title="הוספת תמונות" ></i>
            </td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;float: left;
            margin-left: 2vh;"></i></td>
        </tr>`
    }

    $(".doors_table tbody").append(html)
    $(".upload_btn").unbind().click(UploadFiles)
    $(".image_pirzul").unbind().click(checkFileToPirzul)
    sortItems("pirzul_row")
    $(".remove_row").unbind().click(removeRow)

}

function checkFileToPirzul() {
    let parent_row = $(this).closest(".pirzul_row");
    OpenPreviewGallery('pirzulcollection', (imageIds) => {
        if (imageIds && imageIds.length > 1) {
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
    SetEmptyBlocks([],[])
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    addNewPirzul(null, template.Pirzul)
    $(".remove_row").unbind().click(removeRow);
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}



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

$(document).ready(() => {
    setTimeout(() => {
        $("#add_new_pirzul").unbind().click(addNewPirzul);
        $(".remove_row").unbind().click(removeRow)
    }, 0);
})