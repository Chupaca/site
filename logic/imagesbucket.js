'use strict'


const Storage = require('@google-cloud/storage');
const promise = require("bluebird");
const fs = require("fs");
const globalconfig = require("../globalconfig")

const storage = Storage({
    keyFilename: './my_app_engin_project_key.json'
});


const UploadNewImage = (image, bucket) => {
    var pathToFile = "uploads/" + image.filename
    return storage
        .bucket(global.BUCKETNAMES[bucket])
        .upload(pathToFile)
        .then((result) => {
            return makePublic(image.filename, bucket)
        })
        .catch(err => {
            console.error('ERROR: upload new file' + pathToFile, err);
            return false;
        });
}


function makePublic(filename, bucket) {
    return storage
        .bucket(global.BUCKETNAMES[bucket])
        .file(filename)
        .makePublic()
        .then(() => {
            return RemoveTempleFileByName(filename)
        })
        .then(() => {
            return true;
        })
        .catch(err => {
            console.error('ERROR: update permissions to file - ' + filename, err);
            return false;
        });
}

function RemoveTempleFileByName(fileName) {
    let filePath = "uploads/" + fileName;
    return new promise((resolve, reject) => {
        fs.unlink(filePath, (result) => {
            if (!result) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
    });
}

const DeleteFile = (filename, bucket) => {
    return storage
        .bucket(global.BUCKETNAMES[bucket])
        .file(filename)
        .delete()
        .then(() => {
            return true;
        })
        .catch(err => {
            console.error('ERROR:', err);
            return promise.reject();
        });

}

const GetAllImages = bucketName => {
    return storage
        .bucket(global.BUCKETNAMES[bucketName])
        .getFiles()
        .then(results => {
            const files = results[0]
            return files;
        })
        .catch(err => {
            console.log(err)
            return null;
        })
}


module.exports = {
    UploadNewImage,
    DeleteFile,
    GetAllImages
}