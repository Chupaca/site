'use strict'

const promise = require("bluebird")
const moment = require("moment");
const momentTz = require("moment-timezone")
const dataStore = require("./connection").Datastore;
const uuid = require('uuid/v4');

exports.GetPageProd = page => {
    if (page) {
        return dataStore.createQuery(page).run()
            .then(res => {
                return res[0][0];
            })
            .catch(err => {
                return err
            })
    } else {
        return promise.resolve({})
    }
}

exports.GetPageByKindAndIndex = (page, index) => {
    if (page && index) {
        return dataStore.createQuery(page).filter('Index', '=', index).run()
            .then(res => {
                return res[0][0];
            })
            .catch(err => {
                return err
            })
    } else {
        return promise.resolve({})
    }
}

exports.GetPage = getPage;
function getPage(page) {
    return dataStore.createQuery(page).order('DateCreate', { descending: true }).run()
        .then(res => {
            return res[0];
        })
        .catch(err => {
            return err
        })
}

exports.GetPageById = getPageById;

function getPageById(id, kind) {
    return dataStore.createQuery(kind).filter('Id', '=', id).run()
        .then(res => {
            return res[0][0]
        })
        .catch(err => {
            return false
        })
}

exports.SetActive = (id, page) => {
    return promise.join(getPage(page), getPageById(id, page + "-tmp"),
        (activeNav, navTmp) => {
            return promise.all([
                dataStore.insert(schemaPage(navTmp, page)),
                dataStore.delete(dataStore.key([page, activeNav[0][dataStore.KEY].name]))
            ])
        })
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })
}


exports.SetNewPage = (data, page) => {
    return dataStore.save(schemaPage(data, page + "-tmp"))
        .then(() => {
            return true;
        })
        .catch((err) => {
            return false;
        });
}

exports.InsertToProd = (data, page) => {
    return dataStore.insert(schemaPage(data, page))
    .then(() => {
        return true;
    })
    .catch((err) => {
        return false;
    });
}

exports.DropAllCollation = page => {
    return dataStore.createQuery(page).select('__key__').run()
        .then(entities => {
            const keys = entities[0].map((entity) => {
                return entity[dataStore.KEY];
            });
            return dataStore.delete(keys)
        })
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        })
}

function schemaPage(data, page) {
    const id = uuid();
    const key = dataStore.key([page, id]);
    const condition = {
        key: key,
        excludeFromIndexes: [
            "Data.Content.ContentHtml",
            "Data.Accordion[].AccordionDescription"
        ],
        data: {
            DateCreate: data.DateCreate || moment().tz("Asia/Jerusalem").toDate(),
            DateCreateDB: data.DateCreateDB || new Date().valueOf(),
            Data: data.Data || data,
            UserName: data.UserName || 'admin',
            Id: data.Id || uuid(),
            Position : data.Position || 0,
            Index : data.Index || data.Position || 0
        }
    };
    return condition;
}


exports.GetSales = () => dataStore.createQuery("sales").run()