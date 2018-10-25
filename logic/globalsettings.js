'use strict'


const promise = require("bluebird");
const navigation = require("./navigationandfooter")



const GetGlobalSettings = () => {
    return promise.all([
        navigation.GetNavigationItems(),
        navigation.GetFooterItems()
    ])
        .then(([navigation, footer]) => {
            return { Navigation: navigation, Footer: footer }
        })
}

module.exports = {
    GetGlobalSettings
}