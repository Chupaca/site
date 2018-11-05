'use strict'


const promise = require("bluebird");
const navigation = require("../data/navigation");
const footer = require("../data/footer");
const pages = require("../data/pages");


const GetGlobalSettings = page => {
    return promise.all([
        navigation.GetNavigationItemsForProd(),
        footer.GetNavigationItemsForProd(),
        pages.GetPageProd(page)
    ])
        .then(([navigation, footer, page]) => {
            return { Navigation: navigation, Footer: footer, Page: page }
        })
}

const GetGlobalSettingsForStartPage = () => {
    return promise.all([
        navigation.GetNavigationItemsForProd(),
        footer.GetNavigationItemsForProd(),
        pages.GetSales('sales'),

    ])
        .then(([navigation, footer, sales]) => {
            return { Navigation: navigation, Footer: footer, Sales: sales[0] }
        })
}

const GetGlobalSettingsAndPageByIndex = (page, index) => {
    return promise.all([
        navigation.GetNavigationItemsForProd(),
        footer.GetNavigationItemsForProd(),
        pages.GetPageByKindAndIndex(page, index),

    ])
        .then(([navigation, footer, page]) => {
            return { Navigation: navigation, Footer: footer, Page: page }
        })
}

module.exports = {
    GetGlobalSettings,
    GetGlobalSettingsForStartPage,
    GetGlobalSettingsAndPageByIndex
}