'use strict'


function saveNewPage() {
    let headNav = { Pixels: [], Nav: [] };
    $(".upper_nav_row").each((i, item) => {
        headNav.Nav.push({
            Position: $(item).find(".Position").val().trim(),
            Title: $(item).find(".Title").val().trim(),
            Link: $(item).find(".Link").val().trim(),
        })
    })

    $(".pixel_row").each((i, item) => {
        headNav.Pixels.push({
            Description: $(item).find(".Description").val().trim(),
            Code: $(item).find(".Code").val().trim()
        })
    })

    if (headNav) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(headNav, 'pixelsandheadnav')
        })
    } else {
        Flash("לא כל השדות של מלאים", "warning")

    }
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
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveSinglePage(data[0].Id, "pixelsandheadnav");
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
    }
}

$(document).ready(() => {
    setTimeout(() => {
        $("#check_valid_pixels").unbind().click(checkIsValidPixels);
        $("#add_pixel").unbind().click(addNewPixel);
        $(".remove_row_pixel").unbind().click(removePixel);
        $("#add_new").unbind().click(addNewUpperNav)
        $(".remove_row_pixel").unbind().click(removePixel)
    }, 0)
})

function checkIsValidPixels() {
    try {
        eval(($("#pixels_wrap").val()))
        $("#pixels_wrap").css("background", "#bef1b8");
        Flash("הקוד של פיקסילים תקין!", "success");
        return true;
    } catch (err) {
        $("#pixels_wrap").css("background", "#f9c6c6");
        Flash("הקוד של פיקסילים לא תקין!", "error");
        return false;
    }
}

function addNewPixel() {
    let title = $("#title_pixel").val().trim();
    let pixelCode = $("#pixels_wrap").val().trim()
    if (true){ //(checkIsValidPixels()) {
        let html = `<tr class="pixel_row" style="width:100%;">
    <td style="width: 5%;"><input type="text" class="Position" value="${$(".pixel_row").length + 1}" style="padding:1vh 1vh;" readonly></td>
    <td style="width: 40%;"><input style="width: 96%;" type="text" class="Description" value="${title}" readonly /></td>
    <td style="display:none;"><textarea class="Code" >${pixelCode}</textarea></td>
    <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_pixel" style="color:red;cursor:pointer;"></i></td>
    </tr>`
        $(".pixels_table tbody").append(html);
        $("#title_pixel, #pixels_wrap").val("")
        $(".remove_row_pixel").unbind().click(removePixel)
    } else {
        return;
    }
}

function addNewUpperNav() {
    let title = $("#nav_title").val().trim();
    let navLink = $("#nav_link").val().trim()
    let html = `<tr class="upper_nav_row" style="width:100%;">
    <td style="width: 5%;"><input type="text" class="Position" value="${$(".upper_nav_row").length + 1}" style="padding:1vh 1vh;" readonly></td>
    <td style="width: 20%;"><input style="width: 96%;" type="text" class="Title" value="${title}" readonly /></td>
    <td style="width: 30%;"><input class="Link" value='${navLink}' readonly  dir="ltr" /><b>&nbsp;/&nbsp;</b></td>
    <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_nav" style="color:red;cursor:pointer;"></i></td>
    </tr>`
    $(".nav_table tbody").append(html);
    $("#nav_title, #nav_link").val("")
    $(".remove_row_nav").unbind().click(removeUpperNav)
}


function removeUpperNav() {
    $(this).closest("tr").remove();
    $(".upper_nav_row").each((i, item) => {
        $(item).find(".Position").val(i + 1)
    })
}

function removePixel() {
    $(this).closest("tr").remove();
    $(".pixel_row").each((i, item) => {
        $(item).find(".Position").val(i + 1)
    })
}


function SetFieldsTemplate(template) {
    $(".nav_table tbody, .pixels_table tbody").empty();
    addNewUpperNavFromTmp(template.Nav);
    addNewPixelFromTmp(template.Pixels);
    $(".switch_wraps[data-wrap='nav_list']").trigger("click");
    return template
}

function addNewUpperNavFromTmp(navs) {
    let html = "";
    navs.forEach(item => {
        html += `<tr class="upper_nav_row" style="width:100%;">
        <td style="width: 5%;"><input type="text" class="Position" value="${item.Position}" style="padding:1vh 1vh;" readonly></td>
        <td style="width: 20%;"><input style="width: 96%;" type="text" class="Title" value="${item.Title}" readonly /></td>
        <td style="width: 30%;"><input class="Link" value='${item.Link}' readonly  dir="ltr" /><b>&nbsp;/&nbsp;</b></td>
        <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_nav" style="color:red;cursor:pointer;"></i></td>
        </tr>`
    })
    $(".nav_table tbody").append(html);
    $("#nav_title, #nav_link").val("")
    $(".remove_row_nav").unbind().click(removeUpperNav)
}

function addNewPixelFromTmp(pixels) {
    let html = "";
    pixels.forEach((item, i) => {
        html += `<tr class="pixel_row" style="width:100%;">
    <td style="width: 5%;"><input type="text" class="Position" value="${i + 1}" style="padding:1vh 1vh;" readonly></td>
    <td style="width: 40%;"><input style="width: 96%;" type="text" class="Description" value="${item.Description}" readonly /></td>
    <td style="display:none;"><textarea class="Code" >${item.Code}</textarea></td>
    <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_pixel" style="color:red;cursor:pointer;"></i></td>
    </tr>`
    })
    $(".pixels_table tbody").append(html);
    $("#title_pixel, #pixels_wrap").val("")
    $(".remove_row_pixel").unbind().click(removePixel)
}