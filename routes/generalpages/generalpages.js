'use strict'

const promise = require("bluebird")
const moment = require('moment');

exports.GetStartPage = (req, res) => {
    res.render('startpage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
};

exports.GetContactPage = (req, res) => {
    res.render('contactpage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetBranchesPage = (req, res) => {
    res.render('branchespage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetCatalogPage = (req, res) => {
    res.render('catalogpage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetAboutUsPage = (req, res) => {
    res.render('aboutuspage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}
exports.GetGalleryPage = (req, res) => {
    res.render('gallerypage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetArchitectsPage = (req, res) => {
    res.render('architectspage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetProjectPage = (req, res) => {
    res.render('projectpage/index', {Desktop:(req.device.type == 'desktop'?true:false) });
}
