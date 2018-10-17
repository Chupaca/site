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

exports.GetArchitectsContactPage = (req, res) => {
    res.render('architectscontactpage/architectscontact', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetProjectPage = (req, res) => {
    res.render('projectpage/project', {Desktop:(req.device.type == 'desktop'?true:false) });
}
exports.GetCommentsPage = (req, res) => {
    res.render('commentspage/comments', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetArchitectsListPage = (req, res) => {
    res.render('architectslistpage/architectslist', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetArchitectPage = (req, res) => {
    res.render('architectpage/architect', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetDoorPage = (req, res) => {
    res.render('doorpage/door', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetSalesPage = (req, res) => {
    res.render('salespage/sales', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetBlogPage = (req, res) => {
    res.render('blogpage/blog', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetVideoPage = (req, res) => {
    res.render('videopage/video', {Desktop:(req.device.type == 'desktop'?true:false) });
}

exports.GetPrivacyPage = (req, res) => {
    res.render('privacypage/privacy', {Desktop:(req.device.type == 'desktop'?true:false) });
}
