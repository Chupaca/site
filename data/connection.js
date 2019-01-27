'use strict'


const Datastore = require('@google-cloud/datastore');
const projectId = 'pandoor-test-site';
const datastore = new Datastore({
    projectId: projectId,
});

exports.Datastore = datastore;
