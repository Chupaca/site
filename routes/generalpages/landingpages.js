'use strict'

const moment = require('moment');
const imagesData = require("../../logic/imagesbucket")


exports.GetPage = (req, res) => {
    let { type, frompage } = req.params;
    if (type || frompage) {
        imagesData.GetAllImages('landing' + (req.device.type == 'desktop' ? '_desktop/' : '_mobile/'))
            .then(files => {
                const imagePath = process.env.LINKTOBUCKETS + 'landing' + (req.device.type == 'desktop' ? '_desktop/' : '_mobile/');
                let links = files.map(file => {
                    if (file.name.includes('sales_door')) {
                        return file.name
                    }
                })
                res.render('landingpages/landingpage', {
                    Desktop: (req.device.type == 'desktop' ? true : false),
                    Url: ('https://pandoor.co.il' + req.url),
                    moment,
                    MetaDescription: "",
                    title: "מחיר משתלם לכולם | דלתות פנדור | חברת הדלתות הגדולה בישראל",
                    FromPage: frompage,
                    ImagePath: imagePath,
                    DoorLinks:links
                });
            })
    } else {
        res.redirect('/')
    }
}

exports.GetCatalogPandoorPDF = (req, res) => {
    res.redirect(`${process.env.LINKTOBUCKETS}default/catalog_pandoor.pdf`)
}