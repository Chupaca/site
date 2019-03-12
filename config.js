'use strict';

if (process.env.NODE_ENV === 'production') {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = "./my_app_engin_project_key.json";
  process.env.BUCKETNAMES = "pandoor_site_1234_";
  process.env.LINKTOBUCKETS = "https://storage.googleapis.com/pandoor_site_1234_";
} else {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = "./pandoorsitedatastorefortest.json";
  process.env.BUCKETNAMES = "pandoor_test_site_1111_";
  process.env.LINKTOBUCKETS = "https://storage.googleapis.com/pandoor_test_site_1111_";
}
process.env.DATE_LAST_MODIFY = new Date().valueOf();
process.env.TOKEN = "2B8C3475-R2D2-472A-8432-DROID5DCDB13";

const dataStore = require("./data/connection").Datastore;
global.GlobalVar = {};

(async () => {
  try {
    let globVar = await dataStore.createQuery('commonwords').run()
    if (GlobalVar && globVar[0][0] && globVar[0][0].Data) {
      GlobalVar = globVar[0][0].Data
    }
  } catch (err) {
    console.error("Can't get global variables!")
  }
})()

const GetSettings = () => {
  return dataStore.createQuery('settings').run()
    .then(res => {
      Object.entries(res[0][0]).forEach(([key, value]) => {
        process.env[key] = value;
      });

      process.env.SEND_TO_CRM = "https://test.panhome.co.il/";

      if (process.env.NODE_ENV === 'production') {
        Object.defineProperty(global, "Protocol", { value: "https", configurable: false, writable: false });
        Object.defineProperty(global, "HostName", { value: "www.pandoor.co.il", configurable: false, writable: false });
        // process.env.SEND_TO_CRM = "https://prod.panhome.co.il/";
      } else {
        Object.defineProperty(global, "Protocol", { value: "http", configurable: false, writable: false });
        Object.defineProperty(global, "HostName", { value: "localhost:3000", configurable: false, writable: false });
        process.env.OAUTH2_CALLBACK = "http://localhost:3000/auth/google/callback";
      }
      Object.defineProperty(global, "Host", { get() { return global.Protocol + "://" + global.HostName }, configurable: false })

      return true;
    })
    .catch(err => {
      return err
    })
}
console.log("test")
module.exports = {
  GetSettings
}