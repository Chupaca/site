'use strict'

const pageslogic = require("../logic/pageslogic.js");

exports.GetRedirects = (req, res) => {
    pageslogic.GetRedirects(req.originalUrl)
        .then(result => {
            if (result) {
                res.redirect(301, result)
            } else {
                res.redirect(301, "/")
            }
        })
}