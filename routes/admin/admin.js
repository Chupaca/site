'use strict'

const promise = require("bluebird")
const moment = require('moment');
const imagesLogic = require("../../logic/imagesbucket.js");
const navLogic = require("../../logic/navigation.js");


exports.Login = (req, res) => {
    res.render("adminpanel/index", {})
}

exports.GetAdminPanel = (req, res) => {
    res.render("adminpanel/index", {})
}

exports.GetNavigationEditor = (req, res) => {
    navLogic.GetNavigationItemsForEdit()
        .then(result => {
            res.render("adminpanel/navigationeditor", { title: "נווה עורך", Nav: result.NavStructure, TmpNavigation:result.TmpNavigation })
        })
}

exports.SetNewNavigation = (req, res) => {
    let { NewNav, TmpNav } = req.body;
    if (NewNav) {
        navLogic.SetNewNavigation(NewNav, TmpNav)
            .then(result => {
                res.sendStatus(200)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.GetAllImages = (req, res) => {
    imagesLogic.GetAllImages()
        .then(images => {
            res.render("adminpanel/imagespreview", { title: "גלריה תמונות", images })
        })
}

exports.UploadNewImage = (req, res) => {
    let image = req.files ? req.files[0] : 0;
    if (image) {
        imagesLogic.UploadNewImage(image)
        res.send(true);
    }
    else {
        res.sendStatus(403);
    }
}

exports.DeleteFile = (req, res) => {
    let { ImageName } = req.body;
    if (ImageName) {
        imagesLogic.DeleteFile(ImageName)
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