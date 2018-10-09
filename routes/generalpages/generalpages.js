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