'use strict'


const Datastore = require('@google-cloud/datastore');
const projectId = 'node-js-firs-app';
const datastore = new Datastore({
    projectId: projectId,
});

exports.Datastore = datastore;
