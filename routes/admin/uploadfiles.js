'use strict'

const promise = require("bluebird")
const moment = require('moment');
const imagesLogic = require("../../logic/imagesbucket.js");

exports.GetAllImages = (req, res) => {
    let { bucket } = req.query;
    imagesLogic.GetAllImages(bucket || "general")
        .then(images => {
            res.render("adminpanel/imagespreview", { title: "גלריה תמונות", images, Partial : bucket })
        })
}

exports.UploadNewImage = (req, res) => {
    let image = req.files ? req.files[0] : 0;
    let { bucket } = req.query;
    if (image && bucket) {
        imagesLogic.UploadNewImage(image, bucket)
        res.send(true);
    }
    else {
        res.sendStatus(403);
    }
}

exports.DeleteFile = (req, res) => {
    let { ImageName, Bucket } = req.body;
    if (ImageName, Bucket) {
        imagesLogic.DeleteFile(ImageName, Bucket)
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