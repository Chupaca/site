'use strict'


const promise = require("bluebird");
const navigation = require("./navigation")



const GetGlobalSettings = () => {
    return promise.all([navigation.GetNavigationItems()]);
}

module.exports = {
    GetGlobalSettings
}