'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let gallery = {};
    gallery.MetaData = GetMetaData();
    gallery.Header = GetHeaderData();
    gallery.Language = $("#language_select option:selected").val() || 0;

    gallery.Content = {
        ContentImages: Array.from($(".check_project img")).map(item => {
            return {
                ImageId: $(item).attr("data-imageid"),
                LinkToBucket: "architects/",
                ProjectId : $(item).attr("data-projectid"),
                Title: $(item).attr("data-title").trim(),
                ArchitectName : $(item).attr("data-architectname").trim()
            }

        }),
        ContentHtml: $(".wrap_content_page .original_html_text").html()
    }

    if (gallery.MetaData && gallery.Header && gallery.Content && gallery.Language) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(gallery, prefixLanguage + "gallery");
            return;
        })
    } else {
        if(!gallery.Language){
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
            SetActiveSinglePage(data[0].Id, prefixLanguage);
            return;
        })
    } else {
        Flash("אי אפשר לשמור ללא דף ולא יותר מ-1", "warning")
        return;
    }
}

$(document).ready(function () {
    $(".check_project").unbind().click(checkProject);
    getAllArchitects()
});


function checkProject() {
    let img = $(this).find("img");
    $(".image_one_p").removeClass("active");
    var checked_image = {};
    $("#preview_architect_projects").css({ "display": "block", "z-index": 3000 });
    $(".image_one_p").unbind().click(function () {
        if ($(this).hasClass("active")) {
            $(".image_one_p").removeClass("active")
            checked_image = {};
        } else {
            $(".image_one_p").removeClass("active")
            $(this).toggleClass("active")
            checked_image = { Id: $(this).attr("data-imageid"), Link: $(this).attr("src"), 
            ProjectId:$(this).attr("data-projectid"), Title: $(this).attr("data-title"), 
            ArchitectName:$(this).attr("data-architectname")};
        }
        return;
    })
    $("#check_item_p").unbind().click((e) => {
        e.preventDefault();
        $(img).attr("src", checked_image.Link);
        $(img).attr("data-imageid", checked_image.Id);
        $(img).attr("data-projectid", checked_image.ProjectId);
        $(img).attr("data-title", checked_image.Title);
        $(img).attr("data-architectname", checked_image.ArchitectName);
        $("#preview_architect_projects").css({ "display": "none", "z-index": -1 });
        return;
    })
    $("#close_modal_p").unbind().click((e) => {
        e.preventDefault();
        $("#preview_architect_projects").css({ "display": "none", "z-index": -1 });
        return
    })
}


function getAllArchitects() {
    $.get("/admin/architectslist")
        .then(architects => {
            if (architects && architects.length) {
                architects.forEach(item => {
                    $("#architects_select").append(`
                        <option data-name="${item.Data.Name}" data-id="${item.Id}" data-phonenumber="${item.Data.PhoneNumber}" data-email="${item.Data.Email}">${item.Data.Name}</option>
                    `)
                })
                $("#architects_select").change(changeArchitect)
            }
        })
}


function changeArchitect() {
    $(".open_gallery_projects").attr("data-architectid", $(this).find("option:selected").data("id")).prop("disabled", false);
    $(".open_gallery_projects").unbind().click(getProjectsListByArchitectId)
}

function getProjectsListByArchitectId() {
    if ($(this).attr("data-architectid") && $(this).attr("data-architectid").length > 5) {
        $.get("/admin/architect/" + $(this).attr("data-architectid").trim() + "/projects")
            .then(projects => {
                if (projects.length) {
                    SetProjectsToList(projects)
                } else {
                    Flash("לאדריכל זה אין פרויקטים מפורסמים!", "warning")
                }
            })
    } else {
        Flash("נא לבחור אדריכל קודם!", "warning")
    }
}

function SetProjectsToList(projects) {
    $("#modal_projects_wrap").empty();
    let html = "";
    projects.forEach(project => {
        html += `<div class="gallery_image"  data-imageid="${project.Data.Content.ContentImages[0].ImageId}" >
            <img class="image_one_p" data-imageid="${project.Data.Content.ContentImages[0].ImageId}" data-projectid="${project.Id}" 
            data-architectname="${encodeURIComponent(project.Data.ArchitectName)}"
            src="${ $("#LinkToBuckets").val().trim() + project.Data.Content.ContentImages[0].LinkToBucket + project.Data.Content.ContentImages[0].ImageId}" 
             data-title="${encodeURIComponent(project.Data.Header.Title)}"
            alt="">
            <div class="desc"><span>${moment(project.DateCreate).format("DD/MM/YYYY")} &nbsp;&nbsp ${project.Data.Header.Title}</span>
            </div></div>`
    })
    $("#modal_projects_wrap").append(html);
    Flash("נא תבחר מקום!")
}

function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    $(".wrap_content_page .original_html_text").html(template.Content.ContentHtml);
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