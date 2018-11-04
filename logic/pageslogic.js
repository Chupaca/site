'use strict'



const promise = require("bluebird");
const pagesRepo = require("../data/pages");

const GetPageForAdmin = page => promise.all([pagesRepo.GetPage(page), pagesRepo.GetPage(page + "-tmp")]);

const GetPageById = (id, page) => pagesRepo.GetPageById(id, page);

const SetNewPage = (data, page) => pagesRepo.SetNewPage(data, page);

const SetActive = (id, page) => pagesRepo.SetActive(id, page);

const SetActiveList = (data, page) => {
    var pages;
    return promise.all(data.map(item => pagesRepo.GetPageById(item.Id, page + "-tmp")))
        .then(pagesDB => {
            pages = pagesDB;
            if (pages && pages.length == 3) {
                pages.forEach(item => {
                    item.Position = data.find(pos => pos.Id == item.Id).Position
                })
                return pagesRepo.DropAllCollation(page)
            } else {
                return false;
            }
        })
        .then(resultDel => {
            if(resultDel){
                return promise.all(pages.map(item => pagesRepo.InsertToProd(item, page)))
            }else{
                return false;
            }
        })
}


module.exports = {
    GetPageForAdmin,
    GetPageById,
    SetNewPage,
    SetActive,
    SetActiveList
}