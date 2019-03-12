'use strict'


function saveNewPage() {
    let architect = {
        Name: $("#architect_name").val().trim(),
        PhoneNumber: $("#architect_phonenumber").val().trim(),
        PhoneNumber2: $("#architect_phonenumber2").val().trim() || "",
        Email: $("#architect_email").val().trim(),
        Location: $("#architect_location").val().replace("מחוז", "").trim(),
        City: $("#architect_city").val().trim(),
        ProfileImage: ($("#client_profileimage").attr("data-imgid") == 'default_architect_icon.png' ? "default/" : "architectsicons/") + $("#client_profileimage").attr("data-imgid").trim(),
        ProfileText: $(".original_html_text").html()
    }

    architect.MetaData = GetMetaData();
    architect.Header = {
        ImageId: $(".wrap_header_page .wrap_images_ .image_one").attr("data-imageid"),
        LinkToBucket: "headers/",
    }

    let flag = true;
    Object.entries(architect).forEach(([key, value]) => {
        if ((!value || value.length < 2) && key != "PhoneNumber2" && key != "ProfileText") {
            $("#architect_" + key.toLowerCase()).css({ "background": "#f6b0b3" })
            flag = false;
        } else if (key == "ProfileText" && !$(".original_html_text").html().length) {
            flag = false;
        } else {
            $("#architect_" + key.toLowerCase()).css({ "background": "#e3f4e5" })
        }
    });

    if (flag && !$("#architect_id").val().trim().length) {
        ConformModal("האם אתה רוצה לשמור אדריכל חדש?", () => {
            SaveNewPageToServer(architect, 'architectslist')
            setTimeout(() => {
                window.location.reload();
            }, 500)
        })
    } else if ($("#architect_id").val().trim().length) {
        ConformModal("האם אתה רוצה לשמור אדריכל ?", () => {
            updateArchitect(architect, $("#architect_id").val().trim())
        })
    } else {
        Flash("לא כל השדות של אדריכל מלאים", "warning")

    }
}

function updateArchitect(data, id) {
    $.ajax({
        url: "/admin/architect/" + id,
        data: JSON.stringify({ Data: data }),
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
        ConformModal("אתה בטוח רוצה לשנות ?", () => {
            SetActiveMultiPages(data, 'architectslist')
        })
    } else {
        Flash("צריך לפחות מתקין אחד!", "warning")
    }
}

function checkFileToClient() {
    OpenPreviewGallery("architectsicons", (imageIds) => {
        if (imageIds && imageIds.length > 1) {
            Flash("אי אפשר לבחור לרקע ראשית יותר מתמונה 1", "warning")
        } else {
            $("#client_profileimage").attr("src", imageIds[0].Link);
            $("#client_profileimage").attr("data-imgid", imageIds[0].Id);
        }
    })
}


function markArchitect() {
    if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        $("#preview_page, #edit_architect").prop("disabled", true);
    } else {
        $(".page_item").removeClass("active");
        $(this).addClass("active");
        $("#preview_page").prop("disabled", false);
        if ($(this).closest("li").attr("data-bucket") == "architectslist-tmp") {
            $("#edit_architect").prop("disabled", false);
        }
    }
}

function editArchitect() {
    let architectId = $(".page_item.active").parent().attr("data-id");
    $.get("/admin/architect/" + architectId)
        .then(architect => {
            SetEmptyBlocks()
            $(".remove_text").trigger("click")
            $("#architect_id").val(architect.Id);
            $("#architect_name").val(architect.Data.Name);
            $("#architect_phonenumber").val(architect.Data.PhoneNumber);
            $("#architect_phonenumber2").val(architect.Data.PhoneNumber2);
            $("#architect_email").val(architect.Data.Email);
            $("#architect_location").val(architect.Data.Location);
            $("#architect_city").val(architect.Data.City);
            $("#client_profileimage").attr("src", $("#LinkToBuckets").val().trim() + architect.Data.ProfileImage);
            $(".remove_row_meta").unbind().click(removeMetaRow);
            $(".original_html_text").html(architect.Data.ProfileText || "");
            $(".switch_wraps[data-wrap='metadata']").trigger("click");
            $(".meta_data_table tbody").html(BuildMetaRow(architect.Data.MetaData));
            GetImagePreviewFormattingTemplate([architect.Data.Header.ImageId], [architect.Data.Header.LinkToBucket], "headers");
        })
        .fail(err => {
            Flash("התרחשה שגיאה", "error")
        })
}

$(document).ready(() => {
    setTimeout(() => {
        $(".open_gallery_clients").unbind().click(checkFileToClient)
        $(".remove_client_image").unbind().click(() => {
            $("#client_profileimage").attr("src", $("#LinkToBuckets").val().trim() + "default/default_architect_icon.png");
            $("#client_profileimage").attr("data-imgid", "default_architect_icon.png");
        })
        $(".page_item").unbind().click(markArchitect);
        $("#edit_architect").unbind().click(editArchitect)
    }, 0);
    autoCompleteArchitects();
})

//=====================
function initMap() {
    var input = document.getElementById('architect_city');
    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setTypes(['(cities)']);
    autocomplete.setFields(['address_components']);
    autocomplete.addListener('place_changed', function () {
        let place = autocomplete.getPlace();
        if (place && place.address_components) {
            let location = place.address_components.find(item => item.types[0] == "administrative_area_level_1")
            document.getElementById("architect_location").value = location.short_name.trim();
        }
    });
}

function autoCompleteArchitects() {
    let archList = JSON.parse($("#architects_list").val());
    $("#searchArchitects").autocomplete({
        source: function (search, results) {
            if (search.term.length > 1) {
                var matcher = new RegExp($.ui.autocomplete.escapeRegex(search.term), "i")
                let list = archList.filter(item => {
                    if (matcher.test(item.Name)) {
                        return item;
                    }
                })
                results(list)
            }
        },
        select: function (ev, choice) {
            setTimeout((name)=> {$("#searchArchitects").val(name)},0, choice.item.Name);
            $(".connectedSortable li").each((i, item) => {
                $(item).css("display", "none");
                if($(item).attr("data-id") == choice.item.Id){
                    $(item).css("display", "block");
                }
            })
        },
        focus: function( event, ui ) {
            $(".auto_com_row[data-id='" + ui.item.Id + "']").css({"background":"#ff4200"})
        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
            return $( "<li class='auto_com_row' style='padding:1vh;'>" )
            .attr( "data-name", item.Name )
            .attr( "data-id", item.Id )
            .append( item.Name )
            .appendTo( ul );
        };
};

function clearSearch(){
    $(".connectedSortable li").css("display", "block");
    $("#searchArchitects").val("")
}

$("#template_meta").unbind().click(()=>{
    $(".meta_data_table tbody").append(`
    <tr>
            <td style="width: 23vh;">
                <select class="type_meta_select">
                    <option value="description" selected="">Description</option>
                    <option value="keywords">Keywords</option>
                    <option value="title">Title</option>

                    <option value="og:description">Micro Description</option>
                    <option value="og:title">Micro Title</option>
                </select>
            </td>
            <td><input value=" באינדקס אדריכלים של דלתות פנדור"></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
        </tr><tr>
            <td style="width: 23vh;">
                <select class="type_meta_select">
                    <option value="description">Description</option>
                    <option value="keywords">Keywords</option>
                    <option value="title">Title</option>

                    <option value="og:description" selected="">Micro Description</option>
                    <option value="og:title">Micro Title</option>
                </select>
            </td>
            <td><input value="   באינדקס אדריכלים של דלתות פנדור"></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
        </tr><tr>
            <td style="width: 23vh;">
                <select class="type_meta_select">
                    <option value="description">Description</option>
                    <option value="keywords">Keywords</option>
                    <option value="title" selected="">Title</option>

                    <option value="og:description">Micro Description</option>
                    <option value="og:title">Micro Title</option>
                </select>
            </td>
            <td><input value="  | דלתות פנדור | חברת הדלתות הגדולה בישראל"></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
        </tr><tr>
            <td style="width: 23vh;">
                <select class="type_meta_select">
                    <option value="description">Description</option>
                    <option value="keywords">Keywords</option>
                    <option value="title">Title</option>

                    <option value="og:description">Micro Description</option>
                    <option value="og:title" selected="">Micro Title</option>
                </select>
            </td>
            <td><input value="   | דלתות פנדור | חברת הדלתות הגדולה בישראל"></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
        </tr><tr>
            <td style="width: 23vh;">
                <select class="type_meta_select">
                    <option value="description">Description</option>
                    <option value="keywords" selected="">Keywords</option>
                    <option value="title">Title</option>

                    <option value="og:description">Micro Description</option>
                    <option value="og:title">Micro Title</option>
                </select>
            </td>
            <td><input value="  , דלתות פנדור"></td>
            <td style="width: 5vh;"><i class="fas fa-trash-alt remove_row_meta" style="color:red;cursor:pointer;"></i></td>
        </tr>
    `);
    $(".remove_row_meta").unbind().click(removeMetaRow)
})