'use strict'

let doorsPagesSelect = [];

function saveNewPage() {
    let catalog = {DoorPages:[]};
    catalog.MetaData = GetMetaData();
    catalog.Header = GetHeaderDataWithOutImage();

    Array.from($(".door_page_row")).forEach(page => {
        catalog.DoorPages.push({
            Position: $(page).find(".Position").val().trim(),
            CollectionId: $(page).find("#door_pages_select option:selected").val().trim(),
            CollectionName: $(page).find("#door_pages_select option:selected").text().trim(),
            IndexPage: $(page).find("#door_pages_select option:selected").attr("data-position-page").trim(),
            Description: $(page).find(".Description").val().trim()
        })
    })

    if (catalog.MetaData) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServerCatalog(catalog, "catalog");
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
            SetActiveSinglePage(data[0].Id, "catalog");
            return;
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
        return;
    }
}

function SaveNewPageToServerCatalog(dataPage, bucket) {
    $.ajax({
        url: "/admin/setnewcatalogpage",
        data: JSON.stringify({ DataPage: dataPage, Page: bucket }),
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

function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".wrap_header_page .title_header").val(template.Header.Title),
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    addDoorPage(null, template.DoorPages)
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}


function getDoorPages() {
    $.get("/admin/doorspageslist")
        .then(pages => {
            if (pages && pages.length) {
                doorsPagesSelect = pages
            }
            return;
        })
}

function addDoorPage(e, doorsPages) {
    let html = '';
    if (doorsPages) {
        doorsPages.forEach(page => {
            html += `<tr  class="door_page_row" style="width:100%;">
            <td style="width: 5%;"><input type="text" class="Position" value="${page.Position}" placeholder="" style="padding:1vh 1vh;" readonly></td>
            <td style="width: 15%;"><select id="door_pages_select"><option>בחר...</option>`;

            doorsPagesSelect.forEach(item => {
                html += `<option value="${item.Data.Collection}" ${item.Data.Collection == page.CollectionId ? 'selected' : ''} data-position-page="${item.Position}" >${item.Data.Header.Title}</option>`;
            })

            html += `</select>
            </td>
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="Description" value="${page.Description}" placeholder="כותרת" ></td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
        </tr>`;
        })
    } else {
        html += `<tr  class="door_page_row" style="width:100%;">
            <td style="width: 5%;"><input type="text" class="Position" value="" placeholder="" style="padding:1vh 1vh;" readonly></td>
            <td style="width: 15%;"><select id="door_pages_select"><option>בחר...</option>`;

        doorsPagesSelect.forEach(item => {
            html += `<option value="${item.Data.Collection}" data-position-page="${item.Position}">${item.Data.Header.Title}</option>`;
        })

        html += `</select>
            </td>
            <td style="width: 48%;"><input style="width: 96%;" type="text" class="Description" placeholder="כותרת" ></td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row" style="color:red;cursor:pointer;"></i></td>
        </tr>`;
    }

    $(".doors_pages tbody").append(html)
    sortItems("door_page_row")
    $(".remove_row").unbind().click(removeRow)

}

function removeRow(){
    $(this).closest("tr").remove();
}

function sortItems(classItems) {
    $("." + classItems).each((i, item) => {
        $(item).find(".Position").val(i + 1)
    })
}

$(document).ready(() => {
    setTimeout(() => {
        getDoorPages();
        $("#add_door_page").unbind().click(addDoorPage);
    }, 0)
})