'use strict'


const promise = require("bluebird");
const navigation = require("../data/navigation");
const footer = require("../data/footer");



const GetGlobalSettings = () => {
    return promise.all([
        navigation.GetNavigationItemsForProd(),
        footer.GetNavigationItemsForProd()
    ])
        .then(([navigation, footer]) => {
            return { Navigation: navigation, Footer: footer }
        })
}

module.exports = {
    GetGlobalSettings
}