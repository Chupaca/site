'use strict'


global.BUCKETNAMES = {
    "headers" : "pandoor_test_site_headers",
    "sales" : "pandoor_test_site_sales",
    "generals" : "pandoor_test_site_generals",
    "doors" : "pandoor_test_site_doors",
    "architects" : "pandoor_test_site_architects"
}


Object.defineProperty(global, "Protocol", { value: "http", configurable: false, writable: false })
Object.defineProperty(global, "HostName", { value: "localhost:3000", configurable: false, writable: false })

// production ================
// Object.defineProperty(global, "Protocol", { value: "https", configurable: false, writable: false })
// Object.defineProperty(global, "HostName", { value: "pandoor.co.il", configurable: false, writable: false })

//===========
Object.defineProperty(global, "Host", { get() { return global.Protocol + "://" + global.HostName }, configurable: false })






