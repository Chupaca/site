'use strict'

const promise = require("bluebird");
const datastore = require("../data/connection").Datastore;
const uuid = require('uuid/v4');



const GetNavigationItems = () => {
    const kind = 'Navigation';
    return datastore.createQuery(kind).order('DateCreate', { descending: true }).limit(1).run()
        .then(res => {
            return { NavStructure: res[0][0].NavStructure.sort((a, b) => a.Position - b.Position), TmpNavigation: res[0][0].TmpNavigation || [] };
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

//================== footer ========================

const GetFooterItems = () => {
    const kind = 'FooterNavigation';
    return datastore.createQuery(kind).order('DateCreate', { descending: true }).limit(1).run()
        .then(res => {
            return { 
                NavStructure: res[0][0].NavStructure.sort((a, b) => a.Position - b.Position) || [], 
                TmpNavigation: res[0][0].TmpNavigation || [], 
                Branches: res[0][0].Branches.sort((a, b) => a.Position - b.Position) || [] 
            };
        })
        .catch(err => {
            return {NavStructure : [], TmpNavigation : [], Branches:[]}
        })
}

const SetNewFooter = (newNavSettings, tmpNav, branches) => {
    const kind = 'FooterNavigation';
    const id = new Date().valueOf();
    const key = datastore.key([kind, id]);
    const condition = {
        key: key,
        data: {
            DateCreate: new Date().valueOf(),
            NavStructure: newNavSettings || [],
            TmpNavigation: tmpNav || [],
            Branches : branches || []
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
    SetNewNavigation,
    GetFooterItems,
    SetNewFooter
}