'use strict'

const promise = require("bluebird")
const moment = require('moment');

exports.GetStartPage = (req, res) => {
    res.render('startpage/startpage', {Desktop:(req.device.type == 'desktop'?true:false) });
};

exports.GetContactPage = (req, res) => {
    res.render('contactpage/contact', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetBranchesPage = (req, res) => {
    res.render('branchespage/branches', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetCatalogPage = (req, res) => {
    res.render('catalogpage/catalog', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetAboutUsPage = (req, res) => {
    res.render('aboutuspage/aboutus', {Desktop:(req.device.type == 'desktop'?true:false) });
}
exports.GetGalleryPage = (req, res) => {
    res.render('gallerypage/gallery', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetArchitectsPage = (req, res) => {
    res.render('architectspage/architects', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetProjectPage = (req, res) => {
    res.render('projectpage/project', {Desktop:(req.device.type == 'desktop'?true:false) });
}
exports.GetCommentsPage = (req, res) => {
    res.render('commentspage/comments', {Desktop:(req.device.type == 'desktop'?true:false) });
}
