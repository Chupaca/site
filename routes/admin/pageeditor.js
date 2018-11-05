'use strict'

const promise = require("bluebird")
const moment = require('moment');
const pageslogic = require("../../logic/pageslogic.js");



exports.GetPageForEdit = (req, res) => {
    const { page } = req.query;
    pageslogic.GetPageForAdmin(page)
        .then(([prod, tmp]) => {
            res.render("adminpanel/pages/" + page, { Prod: prod[0], Prods:prod, Versions: tmp, moment })
        })
}

exports.GetPageById = (req, res) => {
    const { id, page } = req.params;
    if (id && page) {
        pageslogic.GetPageById(id, page)
            .then(([prod, tmp]) => {
                res.render("adminpanel/pages/" + page, { Prod: prod[0] })
            })
    }
}

exports.SetNewPage = (req, res) => {
    const { DataPage, Page } = req.body;
    if (Page && DataPage) {
        pageslogic.SetNewPage(DataPage, Page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetActive = (req, res) => {
    let { id, page } = req.params;
    if (id && page) {
        pageslogic.SetActive(id, page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetActiveList = (req, res) => {
    const { Data, Page } = req.body;
    if (Page && Data) {
        pageslogic.SetActiveList(Data, Page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.DeletePage = (req, res) => {
    const { Id, Page } = req.body;
    if (Page && Id) {
        pageslogic.DeletePage(Id, Page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(501)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.PreviewPage = (req, res) => {
    const {page, bucket, id} = req.params;
    pageslogic.PreviewPage(bucket, id)
        .then(previewPage => {
            res.render(`${page}page/${page}`, { 
                Desktop: (req.device.type == 'desktop' ? true : false),
                Navigation: previewPage.Navigation,
                Footer: previewPage.Footer,
                Page: previewPage.Page.Data
            });
        })
}