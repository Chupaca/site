'use strict'

const promise = require("bluebird")
const moment = require("moment");
const momentTz = require("moment-timezone")
const dataStore = require("./connection").Datastore;
const uuid = require('uuid/v4');
const kindProd = 'Navigation';
const kindTMP = 'Navigation-tmp';

exports.GetNavigationItemsForProd = () => {
    return dataStore.createQuery(kindProd).run()
        .then(res => {
            return { NavStructure: res[0][0].NavStructure.sort((a, b) => a.Position - b.Position) };
        })
        .catch(err => {
            return false
        })
}

exports.GetNavigationItems = getNavigationItems;

function getNavigationItems(kind) {
    return dataStore.createQuery(kind).order("DateCreateDB", { descending: true }).run()
        .then(res => {
            return res[0]
        })
        .catch(err => {
            return false
        })
}

exports.GetNavigationItemsById = getNavigationItemsById;

function getNavigationItemsById(id, kind) {
    return dataStore.createQuery(kind).filter('Id', '=', id).run()
        .then(res => {
            return res[0][0]
        })
        .catch(err => {
            return false
        })
}

exports.SetActive = id => {
    return promise.join(getNavigationItems(kindProd), getNavigationItemsById(id, kindTMP),
        (activeNav, navTmp) => {
            return promise.all([
                dataStore.insert(schemaNavigation(navTmp, kindProd)),
                dataStore.delete(dataStore.key([kindProd , activeNav[0][dataStore.KEY].name]))
            ])
        })
        .then(result => {
            return true
        })
        .catch(err => {
            return false
        })
}


exports.SetNewNavigation = data => {
    return dataStore.save(schemaNavigation(data, kindTMP))
        .then(() => {
            return true;
        })
        .catch(err => {
            return false;
        });
}

function schemaNavigation(data, kind){
    const id = uuid();
    const key = dataStore.key([kind, id]);
    const condition = {
        key: key,
        data: {
            DateCreate: data.DateCreate || moment().tz("Asia/Jerusalem").toDate(),
            DateCreateDB: data.DateCreateDB || new Date().valueOf(),
            NavStructure: data.NavStructure || [],
            TmpNavigation: data.TmpNavigation || [],
            UserName: data.UserName || 'admin',
            Id: data.Id || uuid()
        }
    };
    return condition;
}