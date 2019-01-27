'use strict'

function saveNewPage() {
    try {
        let collection = {
            CollectionName: $("#CollectionName").val().trim(),
            Models: [],
            Doors: []
        }
        Array.from($(".model_row")).forEach(model => {
            collection.Models.push({
                ModelName: $(model).find(".ModelName").val().trim(),
                ModelId: $(model).attr("data-modelid").trim(),
                ModelTitle: $(model).find(".ModelTitle").val().trim(),
                PrimaryImage: "doors/" + $(model).find(".primary_door_wrap").attr("data-imgid").trim(),
                PrimaryImageId: $(model).find(".primary_door_wrap").attr("data-imgid").trim()
            })
        })
        Array.from($(".door_row")).forEach(door => {
            collection.Doors.push({
                ModelId: $(door).find(".model_door_select option:selected").val().trim(),
                Type: $(door).find(".type_door_select option:selected").val().trim(),
                Description: $(door).find(".DoorDescription").val().trim(),
                DoorImage: "doorscollection/" + $(door).find(".sub_model_door_wrap").attr("data-imgid").trim(),
                DoorImageId: $(door).find(".sub_model_door_wrap").attr("data-imgid").trim()
            })
        })
        if (!$("#CollectionId").val().trim()) {
            ConformModal("האם אתה רוצה לשמור קולקציה חדשה?", () => {
                SaveNewPageToServer(collection, "doorcollectionlist");
            })
        } else {
            ConformModal("האם אתה רוצה לשמור אדריכל ?", () => {
                updateCollection(collection, $("#CollectionId").val().trim())
            })
        }
    } catch (err) {
        Flash("לא כל השדות מלאים!", "error");
        return;
    }
}


function updateCollection(data, id) {
    $.ajax({
        url: "/admin/collection/" + id,
        data: JSON.stringify({ Data: data }),
        type: "POST",
        contentType: "application/json",
        success: function () {
            Flash("נשמר בהצלחה!", "success");
            setTimeout(() => {
                window.location.reload();
            }, 300)
        },
        error: function () {
            Flash("התרחשה שגיאה", "error")
        }
    })
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
            SetActiveMultiPages(data, 'doorcollectionlist')
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
    }
}


function uploadDoorsCollections() {
    if (!$(this).attr("data-modelid")) {
        Flash("קודם תבחר דגם!", "warning");
        return;
    }
    UploadFiles.call(this);
}

function onChangeModel() {
    let parent_row = $(this).closest(".door_row");
    $(parent_row).find(".upload_door").attr('data-modelid', $(this).find("option:selected").val().trim())
    $(parent_row).find(".image_door").attr('data-modelid', $(this).find("option:selected").val().trim())
    return;
}

function sortItems(classItems) {
    $("." + classItems).each((i, item) => {
        $(item).find(".Position").val(i + 1)
    })
}


function checkFileDoor() {
    let parent_row = $(this).closest(".door_row");
    if (!$(this).attr("data-modelid")) {
        Flash("קודם תבחר דגם!", "warning");
        return;
    }
    OpenPreviewGalleryModelDoors("doorscollection", $(this).attr("data-modelid"), (imageIds) => {
        if (imageIds && imageIds.length > 1) {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $(parent_row).find(".sub_model_door_wrap").attr("src", imageIds[0].Link);
            $(parent_row).find(".sub_model_door_wrap").attr("data-imgid", imageIds[0].Id);
            $(parent_row).find(".sub_model_door_wrap").css({ "width": "40%" });
            $(parent_row).find(".sub_model_door_wrap").show(30);
        }
    })
}

function OpenPreviewGalleryModelDoors(bucket, modelId, callback) {
    var checked_image = [];
    $.get({ url: "/admin/allimages?bucket=" + bucket + "&id=" + modelId, cache: false })
        .then(gallery => {
            $("#preview_modal_gallery").find("h2").text(bucket)
            $("#modal_preview_gallery_wrap").html(gallery)
            $("#preview_modal_gallery").css({ "display": "block", "z-index": 3000 });
            $("#modal_preview_gallery_wrap .remove_file").remove();

            $(".image_one").unbind().click(function () {
                if ($(this).hasClass("active")) {
                    checked_image.splice(checked_image.indexOf(checked_image.find(item => item.Id == $(this).attr("data-imageid"), 1)));
                } else {
                    checked_image.push({ Id: $(this).attr("data-imageid"), Link: $(this).attr("src") });
                }
                $(this).toggleClass("active")
                return;
            })
            $("#check_item").unbind().click((e) => {
                e.preventDefault();
                callback(checked_image);
                $("#preview_modal_gallery").css({ "display": "none", "z-index": -1 });
                return;
            })
            $("#close_modal").unbind().click((e) => {
                e.preventDefault();
                $("#preview_modal_gallery").css({ "display": "none", "z-index": -1 });
                return
            })

        })
}

function getDoorsImages() {
    let parent_row = $(this).closest(".model_row");
    OpenPreviewGallery("doors", (imageIds) => {
        if (imageIds && imageIds.length > 1) {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $(parent_row).find(".primary_door_wrap").attr("src", imageIds[0].Link);
            $(parent_row).find(".primary_door_wrap").attr("data-imgid", imageIds[0].Id);
            $(parent_row).find(".primary_door_wrap").css({ "width": "40%" });
            $(parent_row).find(".primary_door_wrap").show(30);
        }
    })
}

function uuid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 11; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
        if (i == 4) {
            text += "-"
        }
    }
    return text;
}


function markCollectionItem() {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#preview_page, #edit_collection").prop("disabled", true);
    } else {
        $(".page_item").removeClass("active");
        $(this).addClass("active");
        $("#preview_page").prop("disabled", false);
        if ($(this).closest("li").attr("data-bucket") == "doorcollectionlist-tmp") {
            $("#edit_collection").prop("disabled", false);
        }
    }
}


function addNewModal(e, models) {
    let html = '';
    if (models) {
        models.forEach(model => {
            html += `<tr  class="model_row" style="width:100%;" data-modelid="${model.ModelId}">
            <td style="width: 5%;"><input type="text" class="Position" value="" placeholder="" style="padding:1vh 1vh;" readonly></td>
            <td style="width: 15%;"><input style="width: 96%;" type="text" class="ModelName" value="${model.ModelName}" placeholder="שם דגם" ></td>
            <td style="width: 62%;padding: 0 5vh 0 2vh;"><textarea type="text" class="ModelTitle" placeholder="כותרת דגם" style="padding: 5px 10px;width: 100%;height: 8vh;resize:none;" >
            ${model.ModelTitle}
            </textarea></td>
            <td style="width: 7%;"><img style="width:40%;" class="primary_door_wrap" data-imgid="${model.PrimaryImageId}"  src="${$("#LinkToBuckets").val().trim() + model.PrimaryImage}"/></td>
            <td style="width: 7%;">
                <i class="far fa-image primary_door" style="cursor:pointer;font-size:3vh;" title="תמונת דגם"></i>
                <i class="fas fa-cloud-upload-alt upload_file" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="doors" title="הוספת תמונות"></i>
            </td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
            </tr>`;
        })
    } else {
        html += `<tr  class="model_row" style="width:100%;" data-modelid="${uuid()}">
        <td style="width: 5%;"><input type="text" class="Position" value="" placeholder="" style="padding:1vh 1vh;" readonly></td>
        <td style="width: 15%;"><input style="width: 96%;" type="text" class="ModelName" value="" placeholder="שם דגם" ></td>
        <td style="width: 62%;padding: 0 5vh 0 2vh;"><textarea type="text" class="ModelTitle" placeholder="כותרת דגם" style="padding: 5px 10px;width: 100%;height: 8vh;resize:none;" ></textarea></td>
        <td style="width: 7%;"><img style="display:none;" class="primary_door_wrap" /></td>
        <td style="width: 7%;">
            <i class="far fa-image primary_door" style="cursor:pointer;font-size:3vh;" title="תמונת דגם"></i>
            <i class="fas fa-cloud-upload-alt upload_file" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="doors" title="הוספת תמונות"></i>
        </td>
        <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
        </tr>`
    }


    $(".models_table tbody").append(html)
    $(".primary_door").unbind().click(getDoorsImages);
    $(".upload_file").unbind().click(UploadFiles);
    $(".remove_row").unbind().click(removeRow)
    sortItems("model_row")
}


function addNewDoor(e, doors) {
    let models = Array.from($(".model_row")).map(item => ({ ModelId: $(item).attr("data-modelid").trim(), ModelName: $(item).find(".ModelName").val().trim() }));
    let html = '';
    if (doors) {
        doors.forEach(door => {
            html += `<tr  class="door_row" style="width:100%;">
            <td style="width: 15%;">
                <select class="model_door_select">
                    <option value >בחר דגם</option>`
            models.forEach(model => {
                html += `<option value="${model.ModelId}" ${model.ModelId == door.ModelId ? 'selected' : ''} >${model.ModelName}</option>`
            });
            html += `</select>
            </td>
            <td style="width: 15%;">
                <select class="type_door_select">
                    <option value>בחר סוג</option>
                    <option value="windows" ${door.Type == 'windows' ? 'selected' : ''}>חלונות</option>
                    <option value="engravings" ${door.Type == 'engravings' ? 'selected' : ''}>חריטות</option>
                    <option value="frame" ${door.Type == 'frame' ? 'selected' : ''}>הלבשה</option>
                </select>
            </td>
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="DoorDescription" value="${door.Description}" placeholder="שם דגם" ></td>
            <td style="width: 7%;"><img style="width:40%;" class="sub_model_door_wrap" data-imgid="${door.DoorImageId}"  src="${$("#LinkToBuckets").val().trim() + door.DoorImage}"  /></td>
            <td style="width: 7%;">
                <i class="far fa-image image_door" style="cursor:pointer;font-size:3vh;" data-modelid="${door.ModelId}" title="תמונת דלת"></i>
                <i class="fas fa-cloud-upload-alt upload_door" data-modelid="${door.ModelId}" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="doorscollection" title="הוספת תמונות" ></i>
            </td>
                <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
            </tr>`
        })
    } else {
        html += `<tr  class="door_row" style="width:100%;">
                <td style="width: 15%;">
                    <select class="model_door_select">
                        <option value selected>בחר דגם</option>`
        models.forEach(model => {
            html += `<option value="${model.ModelId}" >${model.ModelName}</option>`
        });
        html += `</select>
            </td>
            <td style="width: 15%;">
                <select class="type_door_select">
                    <option value selected>בחר סוג</option>
                    <option value="windows" >חלונות</option>
                    <option value="engravings" >חריטות</option>
                    <option value="frame" >הלבשה</option>
                </select>
            </td>
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="DoorDescription" value="" placeholder="שם דגם" ></td>
            <td style="width: 7%;"><img style="display:none;" class="sub_model_door_wrap" /></td>
            <td style="width: 7%;">
                <i class="far fa-image image_door" style="cursor:pointer;font-size:3vh;" title="תמונת דלת"></i>
                <i class="fas fa-cloud-upload-alt upload_door" style="margin-right:5px;cursor:pointer;font-size:3vh;" data-bucket="doorscollection" title="הוספת תמונות" ></i>
            </td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
        </tr>`
    }

    $(".doors_table tbody").append(html)
    $(".model_door_select").unbind().change(onChangeModel)
    $(".upload_door").unbind().click(uploadDoorsCollections)
    $(".image_door").unbind().click(checkFileDoor)
    sortItems("door_row")
    $(".sub_model_door_wrap").unbind().click(getDoorsImages);
    $(".remove_row").unbind().click(removeRow)

}

function getForEditCollection() {
    let collectionId = $(".page_item.active").parent().attr("data-id");
    $.get("/admin/collection/" + collectionId)
        .then(collection => {
            SetEmptyBlocks(["#CollectionName", "#CollectionId"], [".doors_table tbody", ".models_table tbody"])
            $("#CollectionName").val(collection.Data.CollectionName);
            addNewModal(null, collection.Data.Models);
            addNewDoor(null, collection.Data.Doors);
            $("#CollectionId").val(collection.Id)
            $(".switch_wraps[data-wrap='models_collection']").trigger("click");
        })
        .fail(err => {
            Flash("התרחשה שגיאה", "error")
        })
}

$(document).ready(() => {
    setTimeout(() => {
        $("#add_new_model").unbind().click(addNewModal);
        $("#add_new_door").unbind().click(addNewDoor);
        $(".primary_door").unbind().click(getDoorsImages);
        $(".page_item").unbind().click(markCollectionItem);
        $("#edit_collection").unbind().click(getForEditCollection)
        $(".remove_row").unbind().click(removeRow)
    }, 0);
})

function removeRow(){
    $(this).closest("tr").remove();
}