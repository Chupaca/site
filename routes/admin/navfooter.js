'use strict'

const promise = require("bluebird")
const moment = require('moment');
const navLogic = require("../../logic/navigationandfooter.js");

exports.GetNavigationEditor = (req, res) => {
    navLogic.GetNavigationItems()
        .then(result => {
            res.render("adminpanel/navigationeditor", { title: "עריכת נווה ראשי", Nav: result.NavStructure, TmpNavigation:result.TmpNavigation })
        })
}

exports.SetNewNavigation = (req, res) => {
    let { NewNav, TmpNav } = req.body;
    if (NewNav) {
        navLogic.SetNewNavigation(NewNav, TmpNav)
            .then(result => {
                res.sendStatus(200)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.GetFooterEditor = (req, res) => {
    navLogic.GetFooterItems()
        .then(result => {
            res.render("adminpanel/footereditor", { title: "עריכת תחתית", Nav: result.NavStructure, TmpNavigation:result.TmpNavigation, Branches:result.Branches })
        })
}

exports.SetNewFooter = (req, res) => {
    let { NewNav, TmpNav, Branches } = req.body;
    if (NewNav && Branches) {
        navLogic.SetNewFooter(NewNav, TmpNav, Branches)
            .then(result => {
                if(result){
                    res.sendStatus(200)
                }else{
                    res.sendStatus(502)
                }
            })
    } else {
        res.sendStatus(403)
    }
}