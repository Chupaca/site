'use strict'

const promise = require("bluebird")
const moment = require('moment');
const imagesLogic = require("../../logic/imagesbucket.js");
const navLogic = require("../../logic/navigationandfooter.js");


exports.Login = (req, res) => {
    res.render("adminpanel/startpage", {title: "דף הבית"})
}

exports.GetAdminPanel = (req, res) => {
    res.render("adminpanel/startpage", {title: "דף הבית"})
}