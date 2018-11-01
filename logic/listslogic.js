'use strict'


const promise = require("bluebird");
const datastore = require("../data/connection").Datastore;
const uuid = require('uuid/v4');

const GetList = list => {
    return promise.all([datastore.createQuery(list).run(), datastore.createQuery(list + "-tmp").run()])
        .then(([prod, tmp]) => {
            return res[0][0].Data;
        })
        .catch(err => {
            return err
        })
}

module.exports = {
    GetList
}