'use strict'

const promise = require("bluebird")
const moment = require("moment");
const momentTz = require("moment-timezone")
const dataStore = require("./connection").Datastore;
const uuid = require('uuid/v4');
const kindProd = 'FooterNavigation';
const kindTMP = 'FooterNavigation-tmp';

exports.GetNavigationItemsForProd = () => {
    return dataStore.createQuery(kindProd).run()
        .then(res => {
            return { NavStructure: res[0][0].NavStructure.sort((a, b) => a.Position - b.Position), Branches: res[0][0].Branches };
        })
        .catch(err => {
            return false
        })
};

exports.GetFooterItems = getFooterItems;

function getFooterItems(kind) {
    return dataStore.createQuery(kind).run()
        .then(res => {
            return res[0]
        })
        .catch(err => {
            return false
        })
}


exports.GetFooterItemsById = getFooterItemsById;

function getFooterItemsById(id, kind) {
    return dataStore.createQuery(kind).filter('Id', '=', id).run()
        .then(res => {
            return res[0][0]
        })
        .catch(err => {
            return false
        })
}

exports.SetActive = id => {
    return promise.join(getFooterItems(kindProd), getFooterItemsById(id, kindTMP),
        (activeNav, navTmp) => {
            return promise.all([
                dataStore.insert(schemaFooter(navTmp, kindProd)),
                dataStore.delete(dataStore.key([kindProd , activeNav[0][dataStore.KEY].name]))
            ])
        })
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })
}


exports.SetNewFooter = data => {
    return dataStore.save(schemaFooter(data, kindTMP))
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
}

function schemaFooter(data, kind){
    const id = uuid();
    const key = dataStore.key([kind, id]);
    const condition = {
        key: key,
        data: {
            DateCreate: data.DateCreate || moment().tz("Asia/Jerusalem").toDate(),
            DateCreateDB: data.DateCreateDB || new Date().valueOf(),
            NavStructure: data.NavStructure || [],
            TmpNavigation: data.TmpNavigation || [],
            Branches: data.Branches || [],
            UserName: data.UserName || 'admin',
            Id: data.Id || uuid()
        }
    };
    return condition;
}