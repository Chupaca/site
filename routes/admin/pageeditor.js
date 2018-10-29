'use strict'

const promise = require("bluebird")
const moment = require('moment');
const pageslogic = require("../../logic/pageslogic.js");



exports.GetPageForEdit = (req, res) => {
    const { page } = req.query;
    pageslogic.GetPage(page)
        .then(result => {
            res.render("adminpanel/pages/" + page, {Data : result})
        })
}

exports.SetPage = (req, res) => {
    const { page } = req.query;
    const { DataPage } = req.body;
    if(page && DataPage){
        pageslogic.SetPage(DataPage, page)
            .then(result => {
                if(result){
                    res.sendStatus(200)
                }else{
                    res.sendStatus(500)
                }
            })
    }else{
        res.sendStatus(403)
    }
}