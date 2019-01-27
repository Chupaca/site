'use strict'


const Storage = require('@google-cloud/storage');
const promise = require("bluebird");
const fs = require("fs");

const storage = Storage({
    keyFilename: './my_app_engin_project_key.json'
});


const UploadNewImage = (image, bucket, architect) => {
    const fileName = Date.now() + "-" + image.originalname;
    const bucketS = storage.bucket(process.env.BUCKETNAMES + bucket);
    const blob = bucketS.file(fileName);
    const blobStream = blob.createWriteStream({
        metadata: {
            contentType: image.mimetype,
            size:image.size,
            originalname:image.originalname
        }
    });

    return new promise((resolve, reject) => {
        blobStream.on('error', (err) => {
            resolve(false);
        });

        blobStream.on('finish', () => {
            resolve(true)
        });

        blobStream.end(image.buffer)
    })
    .then(result => {
        return bucketS.file(fileName)
    })
    .then((result) => {
            if (architect) {
                return result.setMetadata({
                    metadata: {
                        architect: architect
                    }
                })

            } else {
                return true
            }
        })
        .then(res => {
            return makePublic(fileName, bucket)
        })
        .then(res => {
            return fileName
        })
        .catch(err => {
            console.error('ERROR: upload new file' + image.originalname, err);
            return false;
        });

    // return storage
    //     .bucket(process.env.BUCKETNAMES + bucket)
    //     .file(image.originalname)
    //     .createWriteStream().end(image.buffer)
    //     .then((result) => {
    //         if (architect) {
    //             return result[0].setMetadata({
    //                 metadata: {
    //                     architect: architect
    //                 }
    //             })

    //         } else {
    //             return true
    //         }
    //     })
    //     .then(res => {
    //         return makePublic(image.filename, bucket)
    //     })
    //     .catch(err => {
    //         console.error('ERROR: upload new file' + pathToFile, err);
    //         return false;
    //     });
}


function makePublic(filename, bucket) {
    return storage
        .bucket(process.env.BUCKETNAMES + bucket)
        .file(filename)
        .makePublic()
        // .then(() => {
        //     return RemoveTempleFileByName(filename)
        // })
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
        .bucket(process.env.BUCKETNAMES + bucket)
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

const GetAllImages = (bucket, id) => {
    return storage
        .bucket(process.env.BUCKETNAMES + bucket)
        .getFiles()
        .then(results => {
            const files = results[0];
            if (id) {
                return (files.reduce((prev, curr) => {
                    if (curr.metadata && curr.metadata.metadata && curr.metadata.metadata.architect == id) {
                        prev.push(curr)
                    }
                    return prev
                }, []))
            } else {
                return files;
            }
        })
        .catch(err => {
            console.log(err)
            return [];
        })
}


module.exports = {
    UploadNewImage,
    DeleteFile,
    GetAllImages
}