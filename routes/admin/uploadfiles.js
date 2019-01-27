'use strict'

const promise = require("bluebird")
const moment = require('moment');
const imagesLogic = require("../../logic/imagesbucket.js");

exports.GetGalleryEditor = (req, res) => {
    imagesLogic.GetAllImages("generals")
        .then(images => {
            res.render("adminpanel/galleryeditor", { title: "גלריה תמונות", images, bucketFile: 'generals', controller: null, AllowRemove:true })
        })
}

exports.GetAllImages = (req, res) => {
    let { bucket, id } = req.query;
    imagesLogic.GetAllImages(bucket || "generals", id)
        .then(images => {
            images = images.sort((a, b) => {
                if (moment(a.metadata.timeCreated).isBefore(b.metadata.timeCreated)) {
                    return 1;
                }
                if (moment(b.metadata.timeCreated).isBefore(a.metadata.timeCreated)) {
                    return -1;
                }
                return 0
            })
            res.render("adminpanel/imagespreview", { images, bucketFile: bucket , AllowRemove:false})
        })
}

exports.UploadNewImage = (req, res) => {
    let image = req.files ? req.files[0] : 0;
    let { bucket, architect } = req.query;
    if (image && bucket) {
        imagesLogic.UploadNewImage(image, bucket, architect)
        res.send(true);
    }
    else {
        res.sendStatus(403);
    }
}

exports.DeleteFile = (req, res) => {
    let { ImageName, Bucket } = req.body;
    if (ImageName, Bucket) {
    ImageName = decodeURIComponent(ImageName)
        imagesLogic.DeleteFile(decodeURIComponent(ImageName), Bucket)
            .then(result => {
                res.send(true);
            })
            .catch(err => {
                res.send(false);
            })
    }
    else {
        res.send(false);
    }
}