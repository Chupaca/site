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