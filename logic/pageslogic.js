'use strict'



const promise = require("bluebird");
const pagesRepo = require("../data/pages");
const navigation = require("../data/navigation")
const footer = require("../data/footer")

const GetPageForAdmin = bucket => promise.all([pagesRepo.GetPage(bucket), pagesRepo.GetPage(bucket + "-tmp")]);

const GetPageById = (id, bucket) => pagesRepo.GetPageById(id, bucket);

const SetNewPage = (data, bucket) => pagesRepo.SetNewPage(data, bucket);

const SetActive = (id, bucket) => pagesRepo.SetActive(id, bucket);

const SetActiveList = (data, bucket) => {
    var pages;
    return promise.all(data.map(item => pagesRepo.GetPageById(item.Id, bucket + "-tmp")))
        .then(pagesDB => {
            pages = pagesDB;
            if (pages && pages.length == 3) {
                pages.forEach(item => {
                    item.Position = data.find(pos => pos.Id == item.Id).Position
                })
                return pagesRepo.DropAllCollation(bucket)
            } else {
                return false;
            }
        })
        .then(resultDel => {
            if (resultDel) {
                return promise.all(pages.map(item => pagesRepo.InsertToProd(item, bucket)))
            } else {
                return false;
            }
        })
}

const DeletePage = (id, bucket) => {
    return pagesRepo.GetPageById(id, bucket.replace("-tmp", ''))
        .then(pageItem => {
            if (!pageItem) {
                return  pagesRepo.DeletePage(id, bucket)
            } else {
                return false
            }
        })
}

const PreviewPage = (bucket, id) => {
    return promise.all([
        navigation.GetNavigationItemsForProd(),
        footer.GetNavigationItemsForProd(),
        pagesRepo.GetPageById(id, bucket)

    ])
    .then(([navigation, footer, page]) => {
        return { Navigation: navigation, Footer: footer, Page: page }
    })
}

module.exports = {
    GetPageForAdmin,
    GetPageById,
    SetNewPage,
    SetActive,
    SetActiveList,
    DeletePage,
    PreviewPage
}