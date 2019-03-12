'use strict'
const NotPages = [
    "startpage", "newspandoor", "installers", "architectslist",
    "navigation", "footer", "brancheslist", "recommendedlist",
    "carousel", "commentslist", "blogslist", "redirects", "pixelsandheadnav",
    "incoming_requests", "doorcollectionlist",'pirzul', "incomingrequests", "galleryeditor",
    "designersblogslist", "commonwords"
]

function setup() {
    let page = window.location.href.split("page=")[1];
    let pageShort = window.location.href.split("admin/")[1];
    if (NotPages.includes(page) || NotPages.includes(pageShort)) {
        page = page || pageShort;
        changeStatusItemsNav($("#" + page));
    } else {
        changeStatusItemsNav($("#pages"));
        $(".pages_list").css({ "margin-right": "0" });
        $(".pages_list [data-page='" + window.location.href.split("page=")[1] + "'] li").css({ "background": "#ffffff", "color": "#749cf3" })
        setTimeout(() => {
            $('nav').animate({ scrollTop: $(".pages_list [data-page='" + window.location.href.split("page=")[1] + "'] li").position().top + 400 }, 600, "easeOutBack");
        }, 150)
    }

    $("#pages").unbind().click(function () {
        changeStatusItemsNav($(this).closest(".nav_item"));
        $(".pages_list").css({ "margin-right": "0" })
    })

    $(".switch_wraps").unbind().click(switchWraps);
    $(".open_gallery").unbind().click(checkFileTo);
    $("#sortable, #sortable_tmp").sortable({
        connectWith: ".connectedSortable",
        stop: () => { sortNavItemsAfterChange() }
    }).disableSelection();

    $("#add_new_meta").unbind().click(addNewMeta);
    $(".remove_row_meta").unbind().click(removeMetaRow);
    $(".remove_file").unbind().click(removeImage);

    TextEvents();
    accordionEvents();
    $("#add_row_accardion").unbind().click(addRowAccordion)
    $("#save_new").unbind().click(saveNewPage);
    $("#publish_page").unbind().click(publishPage);
    $(".list_table tr").unbind().click(markRow);
    sortNavItemsAfterChange();
    $(".page_item").unbind().click(markVersionPage);
    $("#preview_page").unbind().click(PreviewPage);
    $(".remove_page").unbind().click(removePage);
    $("#template_page").unbind().click(getTemplatePage);
    $("#language_select_preview").unbind().change(sortAndPreviewSelectedItemsByLanguage)
}

function getTemplatePage() {
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    $.get(`/admin/pagetemplate/${getPageBucket}/${getPageId}`)
        .then(page => {
            SetFieldsTemplate(page)
        })
        .fail(err => {
            Flash("התרחשה שגיאה", "error")
        })
}

function removeImage() {
    let parent = $(this).closest(".image_preview_item");
    ConformModal("האם אתה רוצה למחוק קובץ?", () => {
        $(parent).remove();
    })
}

function removeMetaRow() {
    $(this).closest("tr").remove();
}

function addNewMeta() {
    $(".meta_data_table tbody").append(AddNewMetaHtml())
    $(".remove_row_meta").unbind().click(removeMetaRow);
}

function removePage() {
    let pageId = $(this).attr("data-id");
    let page = $(this).attr("data-page");
    let parent = $(this).closest(".connectedSortable");
    if (pageId) {
        ConformModal("אתה בטוח רוצה למחוק דף ?", () => {
            $.post("/admin/deletepage/", { Page: page, Id: pageId })
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


function PreviewPage() {
    let getPageId = $(".page_item.active").parent().attr("data-id");
    let getPageBucket = $(".page_item.active").parent().attr("data-bucket");
    window.open(`/admin/previewpage/${getPageBucket.replace("-tmp", "")}/${getPageBucket}/${getPageId}`)
}

function markVersionPage() {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#preview_page, #template_page").prop("disabled", true)
    } else {
        $(".page_item").removeClass("active");
        $(this).addClass("active");
        $("#preview_page, #template_page").prop("disabled", false)
    }
}

function sortNavItemsAfterChange() {
    $("#sortable li").each((i, item) => {
        $(item).find(".page_item_position").text(i + 1)
    })
    $("#sortable_tmp li").each((i, item) => {
        $(item).find(".page_item_position").text(0)
    })
}

function markRow() {
    $(".list_table tr td").css({ "background": "#ffffff" });
    $(this).addClass("active");
    $(this).find("td").css({ "background": "#ccc" });
}

function accordionEvents(partial) {
    if (!partial) {
        $(".accordion_row").unbind().click(function () {
            if ($(this).hasClass("active_row_acc")) {
                $(this).next().slideUp(350)
            } else {
                $(".accordion_row.active_row_acc").next().slideUp(350)
                $(".accordion_row.active_row_acc").removeClass("active_row_acc")
                $(this).next().slideDown(350)
            }
            $(this).toggleClass("active_row_acc");
        });
    }

    $(".accordion_row .remove_acc_row").unbind().click(function (e) {
        e.preventDefault();
        ConformModal("אתה בטוח רוצה לשנות נווה?", () => {
            $(this).parent().next().remove();
            $(this).parent().remove();
        })
    })

}

function TextEvents() {
    $(".text_formated").unbind().click(function () {
        var newWin = window.open('https://wordtohtml.net/', '', 'width=900,height=700');
        newWin.document.close();
    })
    $(".text_area_page_editor").unbind("paste").on("paste", function (event) {
        $(this).next().html(event.originalEvent.clipboardData.getData('text'))
        $(this).next().toggle()
        $(this).toggle();
    })
    $(".remove_text").unbind().click(function () {
        let parent = $(this).closest(".col");
        $(parent).find(".text_area_page_editor").text("").toggle();
        $(parent).find(".original_html_text").empty().toggle();
    })
}


function addRowAccordion() {
    accordionEvents();
    $(".accordion_inside_panel").slideUp(350)
    $(".accordion_container").append(`
            <button class="accordion_row">
            <input value="Section" style="background:#ffffff;color:#000000;"/>
            <i class="fas fa-trash-alt remove_acc_row"></i>
        </button>
        <div class="accordion_inside_panel" style="display: block;">
        <textarea class="text_area_page_editor" style="height: 10vh;"></textarea>
        <div class="original_html_text"></div></div>
    `);
    TextEvents()
    accordionEvents(true);
}

function switchWraps() {
    if (!$(this).hasClass("active")) {
        $(".switch_wraps").removeClass("active")
        $(".wrap_three_col, .wrap_two_col").hide(5);
        $(this).addClass("active")
        $(".wrap_three_col[data-wrap='" + $(this).attr("data-wrap") + "'], .wrap_two_col[data-wrap='" + $(this).attr("data-wrap") + "']").toggle()
    }
    if ($(this).attr("data-wrap") == "versions") {
        $("#save_new, #language_select").prop("disabled", true)
        $("#language_select_preview").prop("disabled", false).css({ "background": '#ff4200' })
        $("#language_select").css({ "background": '#eee' })
    } else {
        $("#save_new, #language_select").prop("disabled", false)
        $("#language_select_preview").prop("disabled", true).css({ "background": '#eee' })
        $("#language_select").css({ "background": '#ff4200' })
    }
}


function checkFileTo() {
    var bucket = $(this).attr("data-bucket")
    OpenPreviewGallery(bucket, (imageIds) => {
        if (imageIds && imageIds.length > 1 && bucket == "headers") {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            GetImagePreviewFormatting(imageIds, bucket)
        }
    })
}

function changeStatusItemsNav(item) {
    $(".nav_item").removeClass("active")
    $(item).addClass("active");
    $(".pages_list").removeAttr("style");
}

function ConformModal(text, callbackConform, callbackCancel) {
    $("#conform_modal").find("h2").text(text)
    $("#conform_modal").css({ "display": "block", "z-index": 3000 });
    $("#conformbtn").unbind().on("click", function (e) {
        e.preventDefault();
        if (callbackConform) {
            callbackConform(true);
        }
        $("#conform_modal").css({ "display": "none", "z-index": -1 });
    })

    $("#cancelbtn").unbind().on("click", function (e) {
        e.preventDefault();
        if (callbackCancel) {
            callbackCancel(true);
        }
        $("#conform_modal").css({ "display": "none", "z-index": -1 });
    })
}

function OpenPreviewGallery(bucket, callback) {
    var checked_image = [];
    $.get({ url: "/admin/allimages?bucket=" + bucket, cache: false })
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



//=============== send to server ================
function SaveNewPageToServer(dataPage, bucket) {
    $.ajax({
        url: "/admin/setnewpage",
        data: JSON.stringify({ DataPage: dataPage, Page: bucket }),
        type: "POST",
        contentType: "application/json",
        success: function () {
            Flash("נשמר בהצלחה!", "success");
            setTimeout(() => {
                $(".switch_wraps[data-wrap='versions']").trigger("click");
                $("#language_select_preview option[value='" + bucket + "']").prop("selected", true).change()
                SetEmptyBlocks(["#datepicker", "#CollectionName", "#CollectionId", ".static_blocks"], [".external_branches_table tbody", ".wrap_images_", ".doors_table tbody", ".models_table tbody"])
            }, 300)
        },
        error: function () {
            Flash("התרחשה שגיאה", "error")
        }
    })
}

function SetActiveSinglePage(id, bucket) {
    $.post(`/admin/pagetoedit/setactive/${id}/${bucket}`)
        .then(res => {
            Flash("נשמר בהצלחה!", "success");
            setTimeout(() => {
                $("#language_select_preview option[value='" + bucket + "']").prop("selected", true).change()
            }, 800)
        })
        .fail(err => {
            Flash("התרחשה שגיאה", "error")
        })
}

function SetActiveMultiPages(data, bucket) {
    $.ajax({
        url: "/admin/pagetoedit/setactive/list",
        data: JSON.stringify({ Data: data, Page: bucket }),
        type: "POST",
        contentType: "application/json",
        success: function () {
            setTimeout(() => {
                $("#language_select_preview option[value='" + bucket + "']").prop("selected", true).change()
            }, 300)
            Flash("נשמר בהצלחה!", "success")
        },
        error: function () {
            Flash("התרחשה שגיאה", "error")
        }
    })
}

function getNotifications() {
    $.get("/admin/notifications")
        .then(notifications => {
            if (notifications.Comments != NaN && notifications.Comments != undefined) {
                if (notifications.Comments) {
                    $(".icons_wrap [name=commentsCount]").text(notifications.Comments).css({ "background": "#ff4545", "display": "block" });
                } else {
                    $(".icons_wrap [name=commentsCount]").text("").css({ "display": "none" });
                }

            }
            if (notifications.Mail != NaN && notifications.Mail != undefined) {
                if (notifications.Mail) {
                    $(".icons_wrap [name=mailCount]").text(notifications.Mail).css({ "background": "#ff4545", "display": "block" });
                } else {
                    $(".icons_wrap [name=mailCount]").text("").css({ "display": "none" });
                }
            }
        })

}

function mouseOverRowVersion() {
    $(".title_news_versions").unbind().mouseover(function () {
        $(this).css({ "white-space": "unset" })
    })
        .mouseleave(function () {
            $(this).css({ "white-space": "nowrap" })
        });
}

function insertDataToRowItemVersion(pathToText, separate) {
    $(".item_data_in_row").each((i, item) => {
        let data = JSON.parse($(item).attr("data-itemdata"))
        if(separate){
            $(item).text($(item).text() + separate + pathToText.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, data));
        }else{
            $(item).text(pathToText.reduce((obj, key) => (obj && obj[key] !== 'undefined') ? obj[key] : undefined, data));
        }
    })
}


$(document).ready(() => {
    getNotifications();
    setup();
    setInterval(() => getNotifications(), 240000);
})
