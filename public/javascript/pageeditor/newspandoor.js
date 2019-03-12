'use strict'


function saveNewPage() {
    let prefixLanguage = $("#language_select option:selected").val() != 'he' ? $("#language_select option:selected").val() + '_' : '';
    let news = {
        NewsText: $("#news_text").val().trim(),
        Language: $("#language_select option:selected").val() || 0
    }
    if (news.length < 10 && !news.Language) {
        if (!news.Language) {
            Flash('נא לבחור שפה!', 'warning');
        } else {
            Flash("אי אפשר לשמור חדשות פחות מ 10 אותיות!", "warning")
        }
    } else {
        ConformModal("אתה בטוח רוצה לשמור חדשות ?", () => {
            SaveNewPageToServer(news, prefixLanguage + 'newspandoor')
        })
    }
}

function publishPage() {
    let data = []
    let prefixLanguage = $("#language_select_preview option:selected").val();
    $("#sortable li").each((i, item) => {
        data.push(
            {
                Position: Number($(item).find(".page_item_position").text()),
                Id: $(item).attr("data-id")
            }
        )
    })

    if (data.length == 0 || data.length < 5) {
        ConformModal("האם אתה רוצה לפרסם גרסה ?", () => {
            SetActiveMultiPages(data, prefixLanguage)
        })
    } else {
        Flash("נא לבחור גרסה!", "warning")
    }
}


$("#deactivate_block").unbind().click(() => {
    $.post(`/admin/pagetoedit/setdeactivate/block/newspandoor`)
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


function SetFieldsTemplate(template) {
    $("#news_text").text(template.NewsText);
    $(".switch_wraps[data-wrap='active_version']").trigger("click");
}

$(document).ready(() => {
    $(".title_news_versions").unbind().mouseover(function () {
        $(this).css({ "white-space": "unset" })
    })
        .mouseleave(function () {
            $(this).css({ "white-space": "nowrap" })
        });
})



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
            insertDataToRowItemVersion(["NewsText"])
            mouseOverRowVersion()
            HideBtnOptionsAfterChangeLanguage(["preview_page"])
            $(".remove_page").unbind().click(removePage)
            $(".page_item").unbind().click(markVersionPage);
        })
}