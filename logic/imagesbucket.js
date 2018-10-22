'use strict'


const Storage = require('@google-cloud/storage');
const promise = require("bluebird");
const fs = require("fs");

const storage = Storage({
    keyFilename: './my_app_engin_project_key.json'
});

const GetAllImages = (bucketName) => {
    return storage
        .bucket('first-site-images-pandoor')
        .getFiles()
        .then(results => {
            const files = results[0]
            return files;
        })
        .catch(err =>{
            console.log(err)
            return null;
        })
}

function MakePublic(bucketName, filename, insertedFile) {
    return storage
        .bucket('first-site-images-pandoor')
        .file(filename)
        .makePublic()
        .then(() => {
            return insertedFile[0].metadata;
        })
        .catch(err => {
            console.error('ERROR: update permissions to file - ' + filename, err);
            return false;
        });
}

module.exports = {
    GetAllImages
}