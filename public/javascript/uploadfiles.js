'use strict'
var fileCollection = new Array();
var permittedTypes = ["jpeg", "jpg", "bmp", "png", "png24"];
const MAX_SIZE = 500000;

function SetupUploadFunctions() {
    $('#upload_image_input').unbind().on('change', onChangeFileToUpload);
    dropUploadFiles();
}

function onChangeFileToUpload(e) {
    var files = e.target.files;
    $.each(files, function (i, file) {
        var typefile = file.name.split(".");
        if (file.size < MAX_SIZE && permittedTypes.indexOf(typefile[typefile.length - 1]) > -1) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function (e) {
                var namefile = uuid() + file.name;
                fileCollectionForIphons.push({ "name": namefile, "base64": e.target.result });

                var template = '<br>' +
                    '<div class="forms_warp"><div class="uk-form forms" >' +
                    '<div class="col"><img src="' + e.target.result + '"  class="image_in_form" data-name="' + (namefile) + '" /></div> ' +
                    '<div class="col col-2"><span class="customerHandlerDisplay" style="width:150px;"><label style="margin-right: 10px;">שם פתח:</label>' + $("#DoorsNameSelect").html() + "</span>" +
                    '<button class="uk-button uk-button-danger removeImage" data-name="' + (namefile) + '" >מחק</button>' +
                    '<br>' +
                    '<div class="progress" data-name="' + (namefile) + '">' +
                    '<div class="progress-bar"></div><div class="status">0%</div></div>' +
                    '</div></div><br>';

                $('#images-to-upload').prepend(template);
                var before_convert = $(".image_in_form[data-name='" + (namefile) + "']");
                if (before_convert[0].naturalWidth > 1500) {
                    $(".image_in_form[data-name='" + (namefile) + "']").css({ "width": before_convert[0].naturalWidth * 0.04, "height": before_convert[0].naturalHeight * 0.04 });
                } else if (before_convert[0].naturalWidth > 0) {
                    $(".image_in_form[data-name='" + (namefile) + "']").css({ "width": before_convert[0].naturalWidth * 0.2, "height": before_convert[0].naturalHeight * 0.2 });
                }

                before_convert[0].onload = function () {
                    var after_conver = compressImage(before_convert[0], namefile, file.size);
                    fileCollection.push(after_conver);
                }
                $(".removeImage").off("click");
                $(".removeImage").on("click", removeImage);
            };
        } else {
            Flash("גודל או סוג קובץ " + file.name + " לא תקין", "error");
        }

    });

    $("body").height($("body").height() + fileCollection.length * 100);

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
                if (file.size < MAX_SIZE && permittedTypes.indexOf(typefile[typefile.length - 1]) > -1) {
                    var reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = function (e) {
                        var template = `<div class="new_image_to_upload">
                        <div class="result_upload"></div>
                        <span>${file.name}</span>
                        <div class="progress" data-name="${file.name}">
                         <div class="progress-bar"></div>
                        </div>
                        </div>`;
                        $('#images_to_upload').prepend(template);
                        fileCollection.push(file);
                        sendToServer((result) => {
                            if (result) {
                                $(".result_upload").append('<i class="fas fa-check-square" style="color:green;"></i>')
                            } else {
                                $(".result_upload").append('<i class="fas fa-exclamation-circle" style="color:red;"></i>')
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

function sendToServer(callback) {
    let sendUrl = "/admin/uploadfiles";
    if (fileCollection.length < 1) {
        if (callback) {
            callback(false);
        }
        return;
    }

    var title = ["", '', 'documents', ""];

    for (var inx = 0; inx < fileCollection.length; inx++) {
        var formdata = new FormData();
        var name = fileCollection[inx].name;

        formdata.append(title, fileCollection[inx]);

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
                        if (percent > 90) {

                        } else {
                            $(".progress[data-name='" + name + "']>.progress-bar").css("width", + percent + "%");
                        }
                    }, true);
                }
                return xhr;
            },
            mimeType: "multipart/form-data"
        }).done(function (result) {
            $(".progress[data-name='" + name + "']>.progress-bar").css("width", + 100 + "%");
            if (result) {
                fileCollection.splice(inx, 1);
                if (callback)
                    callback(true);
            } else {
                if (callback)
                    callback(false);
            }
        }).fail(function (jqXHR, textStatus, errorThrown) {
            Flash("התרחשה שגיאה!", "error");
        });
    }
}