'use strict'


const Datastore = require('@google-cloud/datastore');
let projectId;
if (process.env.NODE_ENV === 'production') {
    projectId = 'pandoor-test-site';
} else {
    projectId = 'pandoorsitedatastorefortest';
}
const datastore = new Datastore({
    projectId: projectId,
});
exports.Datastore = datastore;
