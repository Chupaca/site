'use strict'

const promise = require("bluebird");
const datastore = require("../data/connection").Datastore;
const uuid = require('uuid/v4');
const kind = 'Navigation';


const GetNavigationItems = () => {
    return datastore.createQuery(kind).order('DateCreate', {descending: true}).limit(1).run()
        .then(res => {
            return res[0][0].NavStructure.sort((a, b) => a.Position - b.Position);
        })
        .catch(err => {
            return err
        })

}


const GetNavigationItemsForEdit = () => {
    return datastore.createQuery(kind).order('DateCreate', {descending: true}).limit(1).run()
        .then(res => {
            return { NavStructure: res[0][0].NavStructure.sort((a, b) => a.Position - b.Position) , TmpNavigation:res[0][0].TmpNavigation || []};
        })
        .catch(err => {
            return err
        })
}

const SetNewNavigation = (newNavSettings, tmpNav) => {
    const id = new Date().valueOf();
    const key = datastore.key([kind, id]);
    const condition = {
        key: key,
        data: {
            DateCreate: new Date().valueOf(), 
            NavStructure: newNavSettings,
            TmpNavigation: tmpNav || []
        }
    };

    return datastore
        .save(condition)
        .then(() => {
            return true;
        })
        .catch(err => {
            return false;
        });

}


module.exports = {
    GetNavigationItems,
    GetNavigationItemsForEdit,
    SetNewNavigation
}