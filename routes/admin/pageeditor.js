'use strict'

const promise = require("bluebird")
const moment = require('moment');
// const pageeditor = require("../../logic/pageeditor.js");



exports.GetPageForEdit = (req, res) => {
    const { page } = req.query;
    res.render("adminpanel/pages/" + page, {MetaData:[]})
}