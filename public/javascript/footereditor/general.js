'use strict'

function setupFooterEditor() {
    changeStatusItemsNav($("#footer_edit"))
    bindButtonsEvents();

    $(".switch_wraps").unbind().click(function () {
        $(".switch_wraps").toggleClass("active")
        $(".wrap_three_col, .wrap_two_col").toggle();
    })

    $("#sortable, #sortable_tmp").sortable({
        connectWith: ".connectedSortable",
        stop: () => { sortNavItemsAfterChang() }
    }).disableSelection();

    $("#add_new_nav_item").unbind().click(addNewItem)
    $("#add_new_branch_row").unbind().click(addNewBranch);
    $("#publish_new_footer").unbind().click(publishNewFooter);
    $(".remove_row_branch").unbind().click(removeRowBranch);
    $(".edit_row").unbind().click(editBranchRow);
    $(".btn_arrow_down, .btn_arrow_up").unbind().click(changeRowUpAndDown);

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

function addNewBranch() {
    $(".branches_table tbody").append(`
    <tr>
        <td style="width: 5vh;"><input value="${$(".branches_table tbody tr").length + 1}"  readonly/></td>
        <td style="width: 20vh;"><input value="" placeholder="שם סניף"/></td>
        <td><input value="" placeholder="כתובת"/></td>
        <td style="width: 15vh;"><input value="" placeholder="טל:" /></td>
        <td style="width: 25vh;">
            <button class="btn_class edit_row">&nbsp;<i class="fas fa-edit" ></i>&nbsp;</button>
            <i class="fas fa-arrow-down btn_arrow_down"></i>
            <i class="fas fa-arrow-up btn_arrow_up"></i>
        </td>
        <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_branch" style="color:red;cursor:pointer;"></i></td>
    </tr>
    `)
    $(".remove_row_branch").unbind().click(removeRowBranch);
    $(".edit_row").unbind().click(editBranchRow);
    $(".btn_arrow_down").unbind().click(changeRowUpAndDown);
    $(".btn_arrow_down, .btn_arrow_up").unbind().click(changeRowUpAndDown);
}

function changeRowUpAndDown() {
    var row = $(this).closest("tr");
    if ($(this).is(".btn_arrow_up")) {
        row.insertBefore(row.prev());
    } else {
        row.insertAfter(row.next());
    }
    $(".branches_table tr").each((i, item) => {
        $(item).find("input").first().val(i + 1)
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


function removeRowBranch() {
    $(this).closest("tr").remove();
    $(".branches_table tr").each((i, item) => {
        $(item).find("input").first().val(i + 1)
    })

}

function editBranchRow() {
    $(this).closest("tr").find("input").not(":first").removeAttr("readonly");
}

function publishNewFooter() {
    let newNav = [], tmp_nav = [], branches = [];
    $("#sortable li").each((i, item) => {
        newNav.push(
            {
                Position: Number($(item).find(".navigate_item_position").text()),
                Description: $(item).find(".navigate_item_desc").text(),
                Link: $(item).find(".link_navigate_item").val()
            }
        )
    })

    $("#sortable_tmp li").each((i, item) => {
        tmp_nav.push(
            {
                Position: Number($(item).find(".navigate_item_position").text()),
                Description: $(item).find(".navigate_item_desc").text(),
                Link: $(item).find(".link_navigate_item").val()
            }
        )
    })
    $(".branches_table tr").each((i, item) => {
        branches.push(
            {
                Position: Number($(item).find("td:eq(0) input").val()),
                BranchName: $(item).find("td:eq(1) input").val(),
                Address: $(item).find("td:eq(2) input").val(),
                PhoneNumber: $(item).find("td:eq(3) input").val()
            }
        )
    })
    ConformModal("אתה בטוח רוצה לשנות ?", () => {
        $.ajax({
            url: "/admin/setnewfooter",
            data: JSON.stringify({ NewNav: newNav, TmpNav: tmp_nav, Branches: branches }),
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


$(document).ready(() => {
    setupFooterEditor()
})
