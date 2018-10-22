'use strict'


global.BUCKETNAME = "first-site-images-pandoor";


Object.defineProperty(global, "Protocol", { value: "http", configurable: false, writable: false })
Object.defineProperty(global, "HostName", { value: "localhost:3000", configurable: false, writable: false })

// production ================
// Object.defineProperty(global, "Protocol", { value: "https", configurable: false, writable: false })
// Object.defineProperty(global, "HostName", { value: "pandoor.co.il", configurable: false, writable: false })

//===========
Object.defineProperty(global, "Host", { get() { return global.Protocol + "://" + global.HostName }, configurable: false })






