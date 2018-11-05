'use strict'

const promise = require("bluebird")
const moment = require("moment");
const momentTz = require("moment-timezone")
const dataStore = require("./connection").Datastore;
const uuid = require('uuid/v4');

exports.GetPageProd = bucket => {
    if (bucket) {
        return dataStore.createQuery(bucket).run()
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

exports.GetPageByKindAndIndex = (bucket, index) => {
    if (bucket && index) {
        return dataStore.createQuery(bucket).filter('Index', '=', index).run()
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
function getPage(bucket) {
    return dataStore.createQuery(bucket).order('DateCreate', { descending: true }).run()
        .then(res => {
            return res[0];
        })
        .catch(err => {
            return err
        })
}

exports.GetPageById = getPageById;

function getPageById(id, bucket) {
    return dataStore.createQuery(bucket).filter('Id', '=', id).run()
        .then(res => {
            return res[0][0]
        })
        .catch(err => {
            return false
        })
}

exports.SetActive = (id, bucket) => {
    return promise.join(getPage(bucket), getPageById(id, bucket + "-tmp"),
        (activeNav, navTmp) => {
            return promise.all([
                dataStore.insert(schemaPage(navTmp, bucket)),
                dataStore.delete(dataStore.key([bucket, activeNav[0][dataStore.KEY].name]))
            ])
        })
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })
}


exports.SetNewPage = (data, bucket) => {
    return dataStore.save(schemaPage(data, bucket + "-tmp"))
        .then(() => {
            return true;
        })
        .catch((err) => {
            return false;
        });
}

exports.InsertToProd = (data, bucket) => {
    return dataStore.insert(schemaPage(data, bucket))
        .then(() => {
            return true;
        })
        .catch((err) => {
            return false;
        });
}

exports.DropAllCollation = bucket => {
    return dataStore.createQuery(bucket).select('__key__').run()
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

function schemaPage(data, bucket) {
    const id = uuid();
    const key = dataStore.key([bucket, id]);
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
            Position: data.Position || 0,
            Index: data.Index || data.Position || 0
        }
    };
    return condition;
}


exports.GetSales = () => dataStore.createQuery("sales").run()

exports.DeletePage = (id, bucket) => {
    return getPageById(id, bucket)
        .then(item => {
            return dataStore.delete(dataStore.key([bucket, item[dataStore.KEY].name]))
        })
        .catch(err => {
            return false
        })
}