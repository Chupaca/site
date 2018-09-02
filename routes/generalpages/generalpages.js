'use strict'
const promise = require("bluebird")
const moment = require('moment');

exports.GetStartPage = (req, res) => {
    res.render('index', { });
};