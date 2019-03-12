'use strict'

const linkToBuckets = $("#LinkToBuckets").val().trim();

function SetEmptyBlocks(arrayForEmptyValue, arrayForEmptyHTML) {
    $(".meta_data_table tbody").empty();
    $(".static_blocks").val("")
    $(".wrap_images_[data-wrap_images='headers']").empty();
    $(".wrap_images_[data-wrap_images='generals']").empty();
    $(".wrap_images_[data-wrap_images='blogs']").empty();
    $(".wrap_header_page .title_header").empty();
    $(".accordion_container").empty();
    $(".text_area_page_editor").text("").css({ 'display': 'block' });
    $(".original_html_text").empty().css({ 'display': 'none' });
    if (arrayForEmptyValue) {
        $(arrayForEmptyValue.join(",")).val("").text("");
    }
    if (arrayForEmptyHTML) {
        $(arrayForEmptyHTML.join(",")).empty();
    }
}

function GetMetaData() {
    let meta = [];
    $(".meta_data_table tr").each((i, item) => {
        meta.push(
            {
                MetaType: $(item).find(".type_meta_select option:selected").val(),
                MetaDescription: $(item).find("td:eq(1) input").val().trim(),
            }
        )
    })
    if (meta.length) {
        return meta;
    } else {
        return false;
    }
}

function GetHeaderData() {
    let header = {
        ImageId: $(".wrap_header_page .wrap_images_ .image_one").attr("data-imageid"),
        LinkToBucket: $(".wrap_header_page .wrap_images_").attr("data-wrap_images") + "/",
        Title: $(".wrap_header_page .title_header").val(),
        SubTitleHtml: $(".wrap_header_page .original_html_text").html()
    }
    if (SanitizeAllFields(header, ["SubTitleHtml"])) {
        return header;
    } else {
        return false;
    }
}


function GetHeaderDataWithOutImage() {
    let header = {
        Title: $(".wrap_header_page .title_header").val(),
        SubTitleHtml: $(".wrap_header_page .original_html_text").html()
    }
    return header;
}

function GetSimpleContent(notSanitize) {
    let content = {
        ContentImages: Array.from($(".wrap_content_page .wrap_images_ .image_one")).map(item => {
            return {
                ImageId: $(item).attr("data-imageid"),
                LinkToBucket: $(".wrap_content_page .wrap_images_").attr("data-wrap_images") + "/"
            }

        }),
        ContentHtml: $(".wrap_content_page .original_html_text").html()
    }
    if (SanitizeAllFields(content, notSanitize || [])) {
        return content;
    } else {
        return false;
    }
}

function GetImagePreviewFormatting(imageIds, bucket) {
    let html = "";
    imageIds.forEach(imageId => {
        html += `<div class="image_preview_item" data-imageid="${imageId.Id}" >
        <img class="image_one" data-imageid="${imageId.Id}" src="${imageId.Link}" alt="" style="width: 100%;">
            <div class="desc"><span>${imageId.Id.slice(14)}</span>
            <i class="fas fa-trash-alt remove_file" data-imageid="${imageId.Id}" style="float: left;margin-left: 5%;color:red;"></i>
            </div></div>`
    })
    $(".wrap_images_[data-wrap_images='" + bucket + "']").append(html);
    $(".remove_file").unbind().click(removeImage)
}

function GetImagePreviewFormattingTemplate(imageIds, links, bucket) {
    let html = "";
    imageIds.forEach((imageId, i) => {
        html += `<div class="image_preview_item" data-imageid="${imageId}" >
        <img class="image_one" data-imageid="${imageId}" src="${linkToBuckets + links[i] + imageId}" alt="${imageId}" style="width: 100%;">
            <div class="desc"><span>${imageId.slice(14)}</span>
            <i class="fas fa-trash-alt remove_file" data-imageid="${imageId}" style="float: left;margin-left: 5%;color:red;"></i>
            </div></div>`
    })
    $(".wrap_images_[data-wrap_images='" + bucket + "']").append(html);
    $(".remove_file").unbind().click(removeImage)
}

function AddNewMetaHtml() {
    return `
    <tr>
            <td style="width: 23vh;">
                <select class='type_meta_select'>
                    <option value="description" selected>Description</option>
                    <option value="keywords">Keywords</option>
                    <option value="title">Title</option>

                    <option value="og:description">Micro Description</option>
                    <option value="og:title">Micro Title</option>
                    
                </select>
            </td>
            <td><input value="" /></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
    </tr>
    `
}


function SanitizeAllFields(obj, arrayExertionsFields) {
    if (obj) {
        for (let field in obj) {
            if (Object.prototype.toString.call(obj[field]) == '[object Object]' && Object.keys(obj[field]).length) {
                SanitizeAllFields(obj[field], arrayExertionsFields);
            } else if (Object.prototype.toString.call(obj[field]) == '[object Array]' && obj[field].length) {
                for (let inx = 0; inx < obj[field].length; inx++) {
                    SanitizeAllFields(obj[field][inx], arrayExertionsFields);
                }
            } else if (Object.prototype.toString.call(obj[field]) == '[object String]') {
                if ((!obj[field] || obj[field].length == 0) && !arrayExertionsFields.includes(field)) {
                    return false
                }
            } else if ((Object.prototype.toString.call(obj[field]) == '[object Undefined]' || Object.prototype.toString.call(obj[field]) == '[object Null]'
                || isNaN(NaN)) && !arrayExertionsFields.includes(field)) {
                return false
            }
        }
        return true
    } else {
        return false;
    }
}


function BuildMetaRow(metaData) {
    let html = "";
    if (!metaData) {
        return html;
    }
    metaData.forEach(item => {
        html += `<tr>
            <td style="width: 23vh;">
                <select class="type_meta_select">
                    <option value="description" ${ item.MetaType == 'description' ? 'selected' : ''}>Description</option>
                    <option value="keywords" ${item.MetaType == 'keywords' ? 'selected' : ''}>Keywords</option>
                    <option value="title" ${item.MetaType == 'title' ? 'selected' : ''}>Title</option>

                    <option value="og:description" ${item.MetaType == 'og:description' ? 'selected' : ''}>Micro Description</option>
                    <option value="og:title" ${item.MetaType == 'og:title' ? 'selected' : ''}>Micro Title</option>
                </select>
            </td>
            <td><input value="${item.MetaDescription}" /></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
        </tr>`
    })
    return html;
}

function BuildAccordion(accordion) {
    let html = "";
    if (!accordion) {
        return html;
    }
    accordion.forEach(item => {
        html += `<button class="accordion_row">
            <input value="${item.AccordionTitle}" readonly/>
            <i class="fas fa-trash-alt remove_acc_row"></i>
        </button>
        <div class="accordion_inside_panel">
                <textarea class="text_area_page_editor" style="height: 10vh;display:none;" ></textarea>
                <div class="original_html_text" style="display:block;">
                    ${item.AccordionDescription}
                </div>
        </div>`
    })
    return html;
}

function BuildExternalBranch(branches) {
    let html = "";
    if (!branches) {
        return html;
    }
    branches.forEach(item => {
        html += `
        <tr class="ex_branch_row" style="width:100%;">
            <td style="width: 10%;">
            <select class="ex_branch_select">
                    <option value="North" ${ item.Location == 'North' ? 'selected' : ''}>איזור הצפון</option>
                    <option value="Sharon" ${ item.Location == 'Sharon' ? 'selected' : ''}>איזור השרון</option>
                    <option value="Jerusalem" ${ item.Location == 'Jerusalem' ? 'selected' : ''}>איזור ירושלים</option>
                    <option value="Center" ${ item.Location == 'Center' ? 'selected' : ''}>איזור מרכז</option>
                    <option value="Shfela" ${ item.Location == 'Shfela' ? 'selected' : ''}>איזור השפלה</option>
                    <option value="South" ${ item.Location == 'South' ? 'selected' : ''}>איזור דרום</option>
            </select>
            </td>
            <td style="width: 15%;"><input type="text" class="BranchName" value="${ item.BranchName}" placeholder="שם סוכן"></td>
            <td style="width: 15%;"><input type="text" class="City" value="${ item.City}" placeholder="עיר"></td>
            <td style="width: 20%;"><input type="text" class="Address" value="${ item.Address}" placeholder="כתובת"></td>
            <td style="width: 15%;"><input type="text" class="PhoneNumber" value="${ item.PhoneNumber}" placeholder="טל:"></td>
            <td style="width: 15%;"><input type="text" class="Email" value="${ item.Email}" placeholder="אימייל"></td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_external_branch" style="color:red;cursor:pointer;"></i></td>
        </tr>`
    })
    return html;
}

function BuildVideoTable(videoList) {
    let html = "";
    if (!videoList) {
        return html;
    }
    videoList.forEach(item => {
        html += `
        <tr  class="video_row" style="width:100%;">
            <td style="width: 5%;"><input type="text" class="Position" value="${item.Position}" placeholder="" style="padding:1vh 1vh;" readonly></td>
            <td style="width: 40%;"><input style="width: 96%;" type="text" class="Description" value="${item.Description}" placeholder="" ></td>
            <td style="width: 40%;"><input style="width: 96%;" type="text" class="Link" value="${item.Link}" placeholder="לינק" ></td>
            <td style="width: 10%;"><i class="fas fa-arrow-down btn_arrow_down"></i><i class="fas fa-arrow-up btn_arrow_up"></i></td>
            <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_video" style="color:red;cursor:pointer;"></i></td>
        </tr>
        `
    })
    return html;
}

function GetStaticsFieldsBlocks(obj) {
    let flagStatics = true;
    Array.from($(".static_blocks")).forEach(item => {
        if (!$(item).val()) flagStatics = false
        obj[$(item).attr("name")] = $(item).val()
    })
    return flagStatics;
}

function SetStaticsFieldsBlocks(template) {
    if (template && template.StaticsBlocks) {
        Object.entries(template.StaticsBlocks).forEach(([key, value]) => {
            $("[name='" + key + "']").val(value)
        })
    }
    return;
}

function HideBtnOptionsAfterChangeLanguage(arr) {
    arr.forEach(item => {
        $("#" + item).hide(10)
    })
}