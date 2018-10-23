'use strict'


const Storage = require('@google-cloud/storage');
const promise = require("bluebird");
const fs = require("fs");
const globalconfig = require("../globalconfig")

const storage = Storage({
    keyFilename: './my_app_engin_project_key.json'
});


const UploadNewImage = image => {
    var pathToFile = "uploads/" + image.filename
    return storage
        .bucket(global.BUCKETNAME)
        .upload(pathToFile)
        .then((result) => {
            return makePublic(image.filename, result)
        })
        .catch(err => {
            console.error('ERROR: upload new file' + pathToFile, err);
            return false;
        });
}


function makePublic(filename, insertedFile) {
    return storage
        .bucket(global.BUCKETNAME)
        .file(filename)
        .makePublic()
        .then(() => {
            return RemoveTempleFileByName(filename)
        })
        .then(() => {
            return insertedFile[0].metadata;
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

const DeleteFile = filename => {
    return storage
        .bucket(global.BUCKETNAME)
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

const GetAllImages = (bucketName) => {
    return storage
        .bucket(global.BUCKETNAME)
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