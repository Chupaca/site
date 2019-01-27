'use strict'



const promise = require("bluebird");
const pagesRepo = require("../data/pages");

const GetPageForAdmin = bucket => promise.all([pagesRepo.GetPage(bucket), pagesRepo.GetPage(bucket + "-tmp")]);

const GetPageById = (id, bucket) => pagesRepo.GetPageById(id, bucket);

const SetNewPage = (data, bucket) => pagesRepo.SetNewPage(data, bucket);

const SetActive = (id, bucket) => pagesRepo.SetActive(id, bucket);

const SetActiveList = (data, bucket) => {
    var pages;
    return promise.all(data.map(item => pagesRepo.GetPageById(item.Id, bucket + "-tmp")))
        .then(pagesDB => {
            pages = pagesDB;
            if (pages && pages.length) {
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
                return pagesRepo.DeletePage(id, bucket)
            } else {
                return false
            }
        })
}

const PreviewPage = (bucket, id) => {
    return promise.all([
        pagesRepo.GetNavigationItemsForProd(),
        pagesRepo.GetFooterItemsForProd(),
        pagesRepo.GetBranchesItemsForProd(),
        pagesRepo.GetInstallers(),
        pagesRepo.GetPageById(id, bucket),
        pagesRepo.GetPageListProd('commentslist', 6),
        pagesRepo.GetPageListProd('blogslist', 6),

    ])
        .then(([navigation, footer, branches, installers, page, comments, blogslist]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], Installers: installers[0], Page: page, Comments: comments, Blogs: blogslist }
        })
}

const GetAllArchitects = () => pagesRepo.GetAllArchitects();

const UpdateArchitectById = (id, data) => pagesRepo.UpdateArchitectById(id, data);


const PreviewStartPage = (bucket, id) => {
    return promise.all([
        pagesRepo.GetNavigationItemsForProd(),
        pagesRepo.GetFooterItemsForProd(),
        pagesRepo.GetBranchesItemsForProd(),
        pagesRepo.GetSales('sales'),
        pagesRepo.GetNews(),
        pagesRepo.GetBlogs(),
        pagesRepo.GetComments(),
        pagesRepo.RecommendedList(),
        pagesRepo.GetPageById(id, bucket)

    ])
        .then(([navigation, footer, branches, sales, news, blogs, comments, recommendedlist, carousel]) => {
            return {
                Navigation: navigation[0],
                Footer: footer[0],
                Branches: branches[0],
                Sales: sales[0],
                News: news[0],
                Blogs: blogs[0],
                Comments: comments[0],
                RecommendedList: recommendedlist[0],
                Carousel: carousel
            }
        })
}

const GetProjectsByArchitectId = id => pagesRepo.GetAllArchitectProjects(id)

const SetRedirects = redirects => pagesRepo.SetRedirects(redirects)


const GetRedirects = originalUrl => {
    return pagesRepo.GetRedirects()
        .then(redirects => {
            let redirect = redirects.find(item => item.From == originalUrl);
            if (redirect) {
                return redirect.To
            } else {
                return false
            }
        })
}

const DeactivateBlock = block => pagesRepo.DropAllCollation(block);

const GetIncomingRequests = () => {
    return promise.all([pagesRepo.GetPage("architectapplicant-tmp"), pagesRepo.GetPage("projectapplicant-tmp"), pagesRepo.GetPage("architectblankapplicant-tmp")])
        .then(([architectapplicant, projectapplicant, architectblankapplicant]) => {
            return ([].concat(architectapplicant, projectapplicant, architectblankapplicant)).sort((a, b) => {
                if (a.Data.Active && !b.Data.Active) {
                    return -1
                } else if (!a.Data.Active && b.Data.Active) {
                    return 1
                } else {
                    return b.DateCreateDB - a.DateCreateDB
                }
            })
        })
}

const SetNotActiveIncomingRequestById = (id, bucket) => pagesRepo.SetNotActiveIncomingRequestById(id, bucket);

const GetNotifications = () => {
    return promise.all([
        pagesRepo.GetActiveApplicant("architectapplicant-tmp"),
        pagesRepo.GetActiveApplicant("projectapplicant-tmp"),
        pagesRepo.GetActiveApplicant("architectblankapplicant-tmp"),
        pagesRepo.GetPage("commentslist-tmp"),
        pagesRepo.GetPage("commentslist"),
    ])
        .then(([architectapplicant, projectapplicant, architectsblank, commentslist, commentslistProd]) => {
            let countCom = commentslist.reduce((p, c) => {
                if (!commentslistProd.some(item => item.Id == c.Id)) {
                    p++;
                }
                return p;
            }, 0)
            return { Comments: countCom, Mail: architectapplicant[0].length + projectapplicant[0].length + architectsblank[0].length }
        })
}

const UpdateCollectionById = (id, data) => pagesRepo.UpdateCollectionById(id, data);

const GetCollectionsList = () => pagesRepo.GetCollectionsList();

const GetDoorsPagesList = () => pagesRepo.GetDoorsPagesList();

const SetNewCatalogPage = (data, bucket) => {
    if (data && data.DoorPages && data.DoorPages.length){
        return promise.each(data.DoorPages, (doorPages) => {
            return pagesRepo.GetPageById(doorPages.CollectionId, 'doorcollectionlist')
                .then(collection => {
                    let frame = collection.Data.Doors.find(item => item.ModelId == collection.Data.Models[0].ModelId && item.Type == 'frame')
                    doorPages.FrontModelImage = collection.Data.Models[0].PrimaryImage;
                    doorPages.FrameModel = frame?frame.DoorImage:''
                    return true
                })
        })
            .then(result => {
                return pagesRepo.SetNewPage(data, bucket);
            })
        }else{
            return new promise.reject(new Error("error"))
        }
}


module.exports = {
    GetPageForAdmin,
    GetPageById,
    SetNewPage,
    SetActive,
    SetActiveList,
    DeletePage,
    PreviewPage,
    GetAllArchitects,
    UpdateArchitectById,
    PreviewStartPage,
    GetProjectsByArchitectId,
    SetRedirects,
    GetRedirects,
    DeactivateBlock,
    GetIncomingRequests,
    SetNotActiveIncomingRequestById,
    GetNotifications,
    UpdateCollectionById,
    GetCollectionsList,
    GetDoorsPagesList,
    SetNewCatalogPage
}