'use strict'

const promise = require("bluebird")
const moment = require('moment');
const imagesLogic = require("../../logic/imagesbucket.js")


exports.Login = (req, res) => {

}

exports.GetAdminPanel = (req, res) => {
    res.render("adminpanel/index", {})
}

exports.GetAllImages = (req, res) => {
    imagesLogic.GetAllImages()
        .then(images => {
            res.render("adminpanel/imagespreview", { images })
        })
}

exports.UploadNewImage = (req, res) => {
    var image = req.files ? req.files[0] : 0;
    if (image) {
        imagesLogic.UploadNewImage(image)
        res.send(true);
    }
    else {
        res.sendStatus(403);
    }
}