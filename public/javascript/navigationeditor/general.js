'use strict'

function setupNavEditor() {
    changeStatusItemsNav($("#navigation_edit"));
    $(".switch_wraps").unbind().click(function () {
        if (!$(this).hasClass("active")) {
            $(".switch_wraps").removeClass("active")
            $(".wrap_three_col, .wrap_two_col").hide(5);
            $(this).addClass("active")
            $(".wrap_three_col[data-wrap='" + $(this).attr("data-wrap") + "'], .wrap_two_col[data-wrap='" + $(this).attr("data-wrap") + "']").toggle()
        }
        if ($(this).attr("data-wrap") == "versions") {
            $("#save_new").prop("disabled", true)
        } else {
            $("#save_new").prop("disabled", false)
        }
    })

    bindButtonsEvents();
    $("#sortable, #sortable_tmp").sortable({
        connectWith: ".connectedSortable",
        stop: () => { sortNavItemsAfterChange() }
    }).disableSelection();

    $("#sortable.version, #sortable_tmp.version").sortable({
        connectWith: ".connectedSortable",
        stop: () => { sortVersionsItemsAfterChange() }
    }).disableSelection();

    $("#add_new_nav_item").unbind().click(addNewItem);
    $("#save_new").unbind().click(saveNewNav);
    $("#publish_nav").unbind().click(publishNav);
    $(".page_item").unbind().click(markVersionPage);
    $(".remove_page").unbind().click(removeVersion);
    $("#preview_nav").unbind().click(previewNav)
}

function previewNav(){
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    window.open(`/admin/navigationeditor/previewnavigation/${getPageBucket}/${getPageId}`)
}

function removeVersion() {
    let pageId = $(this).attr("data-id");
    let page = $(this).attr("data-page");
    let parent = $(this).closest(".connectedSortable");
    if (pageId) {
        ConformModal("אתה בטוח רוצה למחוק דף ?", () => {
            $.post("/admin/deletepage/" , {Page:page, Id:pageId})
                .then(result => {
                        $(parent).find("li[data-id='" + pageId + "']").remove()
                        Flash("נמחק בהצלחה!", "success");
                })
                .catch(err => {
                    Flash("אי אפשר למחוק דף אם הוה בתצוגה!", "error")
                })
        })
    } else {
        Flash("התרחשה שגיאה", "error")
    }
}


function markVersionPage() {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#preview_nav").prop("disabled", true)
    } else {
        $(".page_item").removeClass("active");
        $(this).addClass("active");
        $("#preview_nav").prop("disabled", false)
    }
}

function addNewItem() {

    $("#sortable_tmp").append(
        `<li class="new_row"><div class="navigate_item new">
               <input class="new_desc" value="" placeholder="שם לינק" style="margin: 0;">
            </div>
            <div class="sub_navigate_item new" style="display:block;">
                <button class="btn_class save_new_item" >save</button>
                <div><input class="new_link" value="" placeholder="קישור" >  <i class="fas fa-trash-alt remove_nav_item"></i></div>
            </div>
            </li>`
    )
    bindButtonsEvents();

    $(".save_new_item").unbind().click(function () {
        let desc = $(".navigate_item.new .new_desc").val()
        let link = $(".sub_navigate_item.new .new_link").val()
        let newItem = `
            <li><div class="navigate_item">
                <span class="navigate_item_position">${"0"}</span>
                <b><span class="navigate_item_desc" style="margin-right:5vh;">${desc}</span></b>
                <i class="fas fa-bars nav_options"></i>
            </div>
            <div class="sub_navigate_item">
                <button class="btn_class">&nbsp;<i class="fas fa-edit" ></i>&nbsp;</button>
                <div><input class="link_navigate_item" value="${link}" readonly>  <i class="fas fa-trash-alt remove_nav_item"></i></div>
            </div></li>`;

        $(".new_row").remove();
        $("#sortable_tmp").append(newItem);
        bindButtonsEvents()
    })
}

function saveNewNav() {
    let data = { NavStructure: [], TmpNavigation: [] };
    $("#sortable li").each((i, item) => {
        data.NavStructure.push(
            {
                Position: Number($(item).find(".navigate_item_position").text()),
                Description: $(item).find(".navigate_item_desc").text(),
                Link: $(item).find(".link_navigate_item").val()
            }
        )
    })
    let tmp_nav = [];
    $("#sortable_tmp li").each((i, item) => {
        data.TmpNavigation.push(
            {
                Position: Number($(item).find(".navigate_item_position").text()),
                Description: $(item).find(".navigate_item_desc").text(),
                Link: $(item).find(".link_navigate_item").val()
            }
        )
    })

    ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
        $.ajax({
            url: "/admin/navigationeditor/setnewnavigation",
            data: JSON.stringify({ Data: data }),
            type: "POST",
            contentType: "application/json",
            success: function (data) {
                Flash("נשמר בהצלחה!", "success")
            },
            error: function () {
                Flash("התרחשה שגיאה", "error")
            }
        })
    })
}


function bindButtonsEvents() {
    $(".navigate_item i").unbind().click(function () {
        $(".sub_navigate_item").not($(this).parent().next()).fadeOut();
        $(this).parent().next().fadeToggle();
    })

    $(".remove_nav_item").unbind().click(removeNavItem)

    $(".sub_navigate_item .btn_class").unbind().click(function () {
        $(this).parent().find(".link_navigate_item").removeAttr("readonly").css("background", "rgb(144, 228, 123)")
    })
}

function removeNavItem() {
    let item = $(this).closest("li");
    ConformModal("רוצה למחוק?", () => {
        $(item).remove()
    })
}


function sortNavItemsAfterChange() {
    $("#sortable li").each((i, item) => {
        $(item).find(".navigate_item_position").text(i + 1)
    })
    $("#sortable_tmp li").each((i, item) => {
        $(item).find(".navigate_item_position").text(0)
    })
}

function sortVersionsItemsAfterChange() {
    $("#sortable.version li").each((i, item) => {
        $(item).find(".page_item_position").text(i + 1)
    })
    $("#sortable_tmp.version li").each((i, item) => {
        $(item).find(".page_item_position").text(0)
    })
}

function markRow() {
    $(".list_table tr td").css({ "background": "#ffffff" });
    $(this).addClass("active");
    if ($(this).index() != 0) {
        $(this).find("td").css({ "background": "#ccc" });
    }
}

function publishNav() {
    let data = [];
    $("#sortable.version li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".page_item_position").text()),
                Id: $(item).attr("data-id")
            }
        )
    })
    if (data && data.length == 1) {
        ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
            $.post("/admin/navigationeditor/setactive/" + data[0].Id)
                .then(res => {
                    Flash("נשמר בהצלחה!", "success");
                    setTimeout(() => {
                        window.location.reload();
                    }, 300)
                })
                .fail(err => {
                    Flash("התרחשה שגיאה", "error")
                })
        })
    } else {
        Flash("נא לבחור גרסה!", "warning")
    }
}

$(document).ready(() => {
    setupNavEditor();
})
