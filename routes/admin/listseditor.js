'use strict'

const promise = require("bluebird")
const moment = require('moment');
const listsLogic = require("../../logic/listslogic.js");


exports.GetListEditor = (req, res) => {
    const { list } = req.params;
    listsLogic.GetList(list)
        .then(result => {
            res.render("adminpanel/lists/" + list, {Data : result})
        })
}

