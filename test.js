// 'use strict'

// const excelToJson = require("convert-excel-to-json")
// const fs = require('fs')
// const pagesRepo = require("./data/pages");

// const result = excelToJson({
//     source: fs.readFileSync('ddd.xlsx') // fs.readFileSync return a Buffer
// });


// function foo(){
//     if(result){
//         let redirects = {};
//         redirects.Links = redirects.Links = Object.values(result)[0].map(item => {
//             let links = {
//                 From: item.A,
//                 To: item.B
//             };
//             return links;
//         });
//        return pagesRepo.SetRedirects(redirects)
//         .then(r => {
//             console.log(r)
//             return true;
//         })
//     }
// }

// foo();

const bcrypt = require("bcrypt")

function foo2() {
    return bcrypt.hash("307909903", 10)
        .then(hash => {
            return hash;
        })
}
foo2()
