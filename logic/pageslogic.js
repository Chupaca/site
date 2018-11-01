'use strict'



const promise = require("bluebird");
const datastore = require("../data/connection").Datastore;
const uuid = require('uuid/v4');


const GetPage = page => {
    return datastore.createQuery(page).order('DateCreate', { descending: true }).limit(1).run()
        .then(res => {
            return res[0][0].Data;
        })
        .catch(err => {
            return err
        })
}


const SetPage = (newPage, page) => {
    const condition = {
        key: datastore.key([page + "-tmp", uuid()]),
        excludeFromIndexes: [
            "Data.Content.ContentHtml",
            "Data.Accordion[].AccordionDescription"
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

const SetPageToList = (newPage, page) => {
    const condition = {
        key: datastore.key([page + "-tmp", uuid()]),
        excludeFromIndexes: [
            "Data.Content.ContentHtml"
        ],
        data: {
            DateCreate: new Date().valueOf(),
            Active:false,
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
};

const SetToProduction = (id, page) => {
return true;
}


module.exports = {
    SetPage,
    GetPage,
    SetPageToList,
    SetToProduction
}