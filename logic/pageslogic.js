'use strict'



const promise = require("bluebird");
const datastore = require("../data/connection").Datastore;
const uuid = require('uuid/v4');


const GetPage = page => {
    const kind = page;
    return datastore.createQuery(kind).order('DateCreate', { descending: true }).limit(1).run()
        .then(res => {
            return res[0][0].Data;
        })
        .catch(err => {
            return err
        })
}


const SetPage = (newPage, page) => {
    const condition = {
        key: datastore.key([page, uuid()]),
        excludeFromIndexes: [
            "Data.Content.ContentHtml"
        ],
        data: {
            DateCreate: new Date().valueOf(),
            Data: newPage
        }
    };

    return datastore.save(condition)
        .then(() => {
            return true;
        })
        .catch(err => {
            return false;
        });
}


module.exports = {
    SetPage,
    GetPage
}