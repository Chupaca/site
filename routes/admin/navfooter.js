'use strict'

const promise = require("bluebird")
const moment = require('moment');
const navLogic = require("../../logic/navigationandfooter.js");

exports.GetNavigationEditor = (req, res) => {
    navLogic.GetNavigationItemsForAdmin()
        .then(([prod, tmp]) => {
            res.render("adminpanel/navigationeditor", { title: "עריכת נווה ראשי", Prod: prod[0], Versions: tmp, moment })
        })
}

exports.GetNavigationById = (req, res) => {
    const { id } = req.params;
    if (id) {
        navLogic.GetNavigationItemsById(id)
            .then(nav => {
                res.send(nav[0])
            })
    } else {
        res.sendStatus(403)
    }

}

exports.SetNewNavigation = (req, res) => {
    let { Data } = req.body;
    if (Data) {
        navLogic.SetNewNavigation(Data)
            .then(() => {
                res.sendStatus(200)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetActive = (req, res) => {
    let { id } = req.params;
    if (id) {
        navLogic.SetActive(id)
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


//================ footer =======================

exports.GetFooterEditor = (req, res) => {
    navLogic.GetFooterItemsForAdmin()
        .then(([prod, tmp]) => {
            res.render("adminpanel/footereditor", { title: "עריכת תחתית", Prod: prod[0], Versions: tmp, moment })
        })
}

exports.GetFooterItemsById = (req, res) => {
    const { id } = req.params;
    if (id) {
        navLogic.GetFooterItemsById(id)
            .then(nav => {
                res.send(nav[0])
            })
    } else {
        res.sendStatus(403)
    }

}

exports.SetNewFooter = (req, res) => {
    let { Data } = req.body;
    if (Data) {
        navLogic.SetNewFooter(Data)
            .then(() => {
                res.sendStatus(200)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetActiveFooter = (req, res) => {
    let { id } = req.params;
    if (id) {
        navLogic.SetActiveFooter(id)
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