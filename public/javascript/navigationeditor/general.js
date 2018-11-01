'use strict'

function setupNavEditor() {
    changeStatusItemsNav($("#navigation_edit"));

    $(".switch_wraps").unbind().click(function () {
        $(".switch_wraps").removeClass("active")
        $(".wrap_three_col, .wrap_two_col").hide(5);
        $(this).addClass("active")
        $(".wrap_three_col[data-wrap='" + $(this).attr("data-wrap") + "'], .wrap_two_col[data-wrap='" + $(this).attr("data-wrap") + "']").toggle()
    })

    bindButtonsEvents();


    $("#sortable, #sortable_tmp").sortable({
        connectWith: ".connectedSortable",
        stop: () => { sortNavItemsAfterChang() }
    }).disableSelection();

    $("#add_new_nav_item").unbind().click(addNewItem);

    $("#save_new").unbind().click(saveNewNav);

    $("#publish_new").unbind().click(publishNav);

    $(".list_table tr").unbind().click(markRow)
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
            url: "/admin/setnewnavigation",
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


function sortNavItemsAfterChang() {
    $("#sortable li").each((i, item) => {
        $(item).find(".navigate_item_position").text(i + 1)
    })
    $("#sortable_tmp li").each((i, item) => {
        $(item).find(".navigate_item_position").text(0)
    })
}

function markRow() {
    $(".list_table tr td").css({ "background": "#ffffff" });
    $(this).addClass("active");
    if ($(this).index() != 0) {
        $(this).find("td").css({ "background": "#ccc" });
    }
}

function previewVersion() {
    const navId = $(this).attr("data-id");
    $.get("/admin/navigationeditor/" + navId)
        .then(nav => {
            $(".preview_version").html(nav)
        })
}

function publishNav() {
    let id = $(".list_table tr.active").attr("data-id");
    if (id) {
        ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
            $.post("/admin/navigationeditor/setactive/" + id)
                .then(res => {
                    Flash("נשמר בהצלחה!", "success");
                    setTimeout(() => {
                        window.location.reload();
                    }, 800)
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
