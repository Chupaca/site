'use strict'

var permittedTypes = ["jpeg", "jpg", "bmp", "png", "png24"];
const MAX_SIZE = 500000;
var bucket = "general";
var architect = "";
var model_door = "";

function SetupUploadFunctions() {
    changeStatusItemsNav($("#images_gallery"));
    $(".radio_btn_buckets").unbind().click(getFilesBucket)
    $(".upload_btn").unbind().click(UploadFiles)
    $(".close_modal").unbind().click(function () {
        $(this).closest(".modal").css({ "display": "none", "z-index": -1 })
    })
    $(".image_one").unbind().click(previewImageModal);
    $('#upload_image_input').unbind().on('change', onChangeFileToUpload);
    dropUploadFiles();
    $(".remove_file").unbind().click(RemoveFile)
}

function UploadFiles() {
    $("#images_to_upload").empty();
    bucket = $(".radio_btn_buckets.active").attr("data-bucket") || $(this).attr("data-bucket") ;
    if(bucket == 'architects'){
        architect = $(this).attr("data-architectid");
    }
    if(bucket == 'doorscollection'){
        model_door = $(this).attr("data-modelid") || '';
    }
    $("#upload_modal").css({ "display": "block", "z-index": 3000 });
}

function getFilesBucket(){
    let buck = $(this).attr("data-bucket");
    $(".radio_btn_buckets").removeClass("active")
    $(this).addClass("active");
    $.get({url: "/admin/allimages?bucket=" + buck, cache: false})
    .then(gallery => {
        $("#gallery_wrap").html(gallery);
        $(".image_one").unbind().click(previewImageModal);
        $(".remove_file").unbind().click(RemoveFile)
    })
}

function previewImageModal() {
    var currImg = Number($(this).attr("data-index"))
    $("#count_images").html((currImg + 1) + "/" + $(".image_one").length)
    $("#project_preview_modal").css({ "display": "block", "z-index": 3000 });
    $("#preview_image").attr("src", this.src);
    $("#project_preview_modal .close").unbind().click(function () {
        $("#project_preview_modal").css({ "display": "none", "z-index": 1 });
    })
    $("#project_preview_modal .next").unbind().click(function () {
        currImg++
        if (currImg == $(".image_one").length) currImg = 0;
        $("#preview_image").attr("src", $(".image_one[data-index='" + currImg + "']").attr("src"));
        $("#count_images").html((currImg + 1) + "/" + $(".image_one").length)
    })
    $("#project_preview_modal .prev").unbind().click(function () {
        currImg--
        if (currImg == -1) currImg = $(".image_one").length - 1;
        $("#preview_image").attr("src", $(".image_one[data-index='" + currImg + "']").attr("src"));
        $("#count_images").html((currImg + 1) + "/" + $(".image_one").length)
    })
}

function RemoveFile() {
    let imageName = $(this).attr("data-imageid");
    let bucketFile = $(this).attr("data-bucket");
    ConformModal("האם אתה רוצה למחוק קובץ?", () => {
        $.post("/admin/uploadfiles/delete", { ImageName: imageName, Bucket:bucketFile })
            .then(result => {
                if (result) {
                    Flash("נמחק בהצלחה!", 'success');
                    $(".gallery_image[data-imageid='" + imageName + "']").remove();
                } else {
                    Flash("התרחשה שגיאה!", "error");
                }
                return;
            })
    })
}


function onChangeFileToUpload(e) {
    var files = e.target.files;
    $.each(files, function (i, file) {
        var typefile = file.name.split(".");
        if (file.size < MAX_SIZE && permittedTypes.indexOf(typefile[typefile.length - 1].toLowerCase()) > -1) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                var fileName = uuid() + file.name;
                var template = `<div class="new_image_to_upload">
                <div class="result_upload" data-name="${fileName}"></div>
                <span>${fileName}</span>
                <div class="progress" data-name="${fileName}">
                 <div class="progress-bar"></div>
                </div>
                </div>`;
                $('#images_to_upload').prepend(template);
                sendToServer(file, fileName, (result, fileName) => {
                    if (result) {
                        $(".result_upload[data-name='" + fileName + "']").append('<i class="fas fa-check-square" style="color:green !important; opacity:1 !important;"></i>')
                    } else {
                        $(".result_upload[data-name='" + fileName + "']").append('<i class="fas fa-exclamation-circle" style="color:red !important; opacity:1 !important;"></i>')
                    }
                });
            };
        } else {
            Flash("גודל או סוג קובץ " + file.name + " לא תקין", "error");
        }
    });
};

function dropUploadFiles() {
    $('.modal-content').on('drop dragover dragenter dragleave dragend', function (e) {
        e.preventDefault();
        e.stopPropagation();
    })
        .on('dragover dragenter', function () {
            $(".modal-content i").css({ "color": "rgb(149, 194, 234)" })
        })
        .on('dragleave dragend drop', function () {
            $(".modal-content i").css({ "color": "rgba(149, 194, 234, 0.2784313725490196)" })
        })
        .on('drop', function (e) {
            var files = e.originalEvent.dataTransfer.files;
            $.each(files, function (i, file) {
                var typefile = file.name.split(".");
                if (file.size < MAX_SIZE && permittedTypes.indexOf(typefile[typefile.length - 1].toLowerCase()) > -1) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    let fileName = uuid() + file.name;
                    reader.onload = function (e) {
                        var template = `<div class="new_image_to_upload">
                        <div class="result_upload" data-name="${fileName}"></div>
                        <span>${fileName}</span>
                        <div class="progress" data-name="${fileName}">
                         <div class="progress-bar"></div>
                        </div>
                        </div>`;
                        $('#images_to_upload').prepend(template);
                        sendToServer(file, fileName, (result, fileName) => {
                            if (result) {
                                $(".result_upload[data-name='" + fileName + "']").append('<i class="fas fa-check-square" style="color:green;"></i>')
                            } else {
                                $(".result_upload[data-name='" + fileName + "']").append('<i class="fas fa-exclamation-circle" style="color:red;"></i>')
                            }
                        });
                    };
                } else {
                    Flash("גודל או סוג קובץ " + file.name + " לא תקין", "error");
                }
            });
            $("#sendAll").show();
        });
}


function uuid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function sendToServer(file, filename, callback) {
    let sendUrl = "/admin/uploadfiles?bucket=" + bucket;
    if(architect){
        sendUrl = "/admin/uploadfiles?bucket=" + bucket + "&architect=" + architect;
    }
    if(model_door){
        sendUrl = "/admin/uploadfiles?bucket=" + bucket + "&architect=" + model_door;
    }
    let title = ["", '', 'documents', ""];
    let formdata = new FormData();
    formdata.append(title, file);
    $.ajax({
        url: sendUrl,
        type: "POST",
        data: formdata,
        headers: { "Access-Control-Allow-Credentials": true },
        contentType: false,
        cache: false,
        processData: false,
        xhr: function () {
            var xhr = $.ajaxSettings.xhr();
            if (xhr.upload) {
                xhr.upload.addEventListener('progress', function (event) {
                    var percent = 0;
                    var position = event.loaded || event.position;
                    var total = event.total;
                    if (event.lengthComputable) {
                        percent = Math.ceil(position / total * 100);
                    }
                    if (percent < 90) {
                        $(".progress[data-name='" + filename + "']>.progress-bar").css("width", + percent + "%");
                    }
                }, true);
            }
            return xhr;
        },
        mimeType: "multipart/form-data"
    }).done(function (result) {
        $(".progress[data-name='" + filename + "']>.progress-bar").css("width", + 100 + "%");
        if (result) {
            if (callback) {
                Flash("קובץ נשמר בהצלחה!", "success", 1000);
                callback(true, filename);
            }
        } else {
            if (callback) {
                Flash("התרחשה שגיאה!", "error");
                callback(false, filename);
            }
        }
    }).fail(function (jqXHR, textStatus, errorThrown) {
        Flash("התרחשה שגיאה!", "error");
    });
}


$(document).ready(()=>{
    SetupUploadFunctions()
})