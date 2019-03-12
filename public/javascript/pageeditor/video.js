'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
   
    let video = {}
    video.MetaData = GetMetaData();
    video.Header = GetHeaderData();
    video.Language = $("#language_select option:selected").val() || 0;

    video.VideoList = Array.from($(".video_row")).map(item => {
        return {
            Position: Number($(item).find(".Position").val().trim()),
            Description: $(item).find(".Description").val().trim(),
            Link: $(item).find(".Link").val().trim()
        }
    });

    if (video.MetaData && video.Header && video.VideoList.length && video.Language) {
        ConformModal("האם אתה רוצה לשמור גרסה חדשה?", () => {
            SaveNewPageToServer(video, prefixLanguage + "video");
        })
    } else {
        if(!video.Language){
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

function removeVideo() {
    ConformModal("אתה בטוח רוצה למחוק ?", () => {
        $(this).closest(".video_row").remove();
    })
}

function addNewVideo() {
    $(".video_table tbody").append(`
    <tr  class="video_row" style="width:100%;">
        <td style="width: 5%;"><input type="text" class="Position" value="" placeholder="" style="padding:1vh 1vh;" readonly></td>
        <td style="width: 40%;"><input style="width: 96%;" type="text" class="Description" value="" placeholder="" ></td>
        <td style="width: 40%;"><input style="width: 96%;" type="text" class="Link" value="" placeholder="לינק" ></td>
        <td style="width: 10%;"><i class="fas fa-arrow-down btn_arrow_down"></i><i class="fas fa-arrow-up btn_arrow_up"></i></td>
        <td style="width: 5%;"><i class="fas fa-trash-alt remove_row_video" style="color:red;cursor:pointer;"></i></td>
    </tr>
    `);
    sortItemsVideoList()
    $(".remove_row_video").unbind().click(removeVideo);
    $(".btn_arrow_down, .btn_arrow_up").unbind().click(changeRowUpAndDown);
}

function sortItemsVideoList() {
    $(".video_row").each((i, item) => {
        $(item).find(".Position").val(i + 1)
    })
}

function changeRowUpAndDown() {
    var row = $(this).closest("tr");
    if ($(this).is(".btn_arrow_up")) {
        row.insertBefore(row.prev());
    } else {
        row.insertAfter(row.next());
    }
    sortItemsVideoList()
}


function SetFieldsTemplate(template) {
    SetEmptyBlocks()
    $(".meta_data_table tbody").html(BuildMetaRow(template.MetaData));
    $(".remove_row_meta").unbind().click(removeMetaRow);
    GetImagePreviewFormattingTemplate([template.Header.ImageId], [template.Header.LinkToBucket], "headers");
    $(".wrap_header_page .title_header").val(template.Header.Title);
    $(".remove_text").trigger("click")
    $(".wrap_header_page .original_html_text").html(template.Header.SubTitleHtml);
    $(".video_table tbody").html(BuildVideoTable(template.VideoList));
    sortItemsVideoList()
    $(".remove_row_video").unbind().click(removeVideo);
    $(".btn_arrow_down, .btn_arrow_up").unbind().click(changeRowUpAndDown);
    $(".switch_wraps[data-wrap='metadata']").trigger("click");
}


$(document).ready(() => {
    setTimeout(() => {
        $("#add_new_video").unbind().click(addNewVideo);
        $(".remove_row_video").unbind().click(removeVideo);
        $(".btn_arrow_down, .btn_arrow_up").unbind().click(changeRowUpAndDown);
    }, 0)
});



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