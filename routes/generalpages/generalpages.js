'use strict'
const promise = require("bluebird")
const moment = require('moment');

exports.GetStartPage = (req, res) => {
    res.render('index', {Desktop:(req.device.type == 'desktop'?true:false) });
};