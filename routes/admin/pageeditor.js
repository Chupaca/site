'use strict'

const promise = require("bluebird")
const moment = require('moment');
const pageslogic = require("../../logic/pageslogic.js");



exports.GetPageForEdit = (req, res) => {
    const { page } = req.query;
    pageslogic.GetPageForAdmin(page)
        .then(([prod, tmp]) => {
            res.render("adminpanel/pages/" + page, { Prod: prod[0], Prods: prod, Versions: tmp, moment, controller: page, UserType:req.user.UserType })
        })
}

exports.GetPageById = (req, res) => {
    const { id, page } = req.params;
    if (id && page) {
        pageslogic.GetPageById(id, page)
            .then(([prod, tmp]) => {
                res.render("adminpanel/pages/" + page, { Prod: prod[0], controller: page, UserType:req.user.UserType })
            })
    }
}

exports.SetNewPage = (req, res) => {
    const { DataPage, Page } = req.body;
    if (Page && DataPage) {
        pageslogic.SetNewPage(DataPage, Page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetActive = (req, res) => {
    let { id, page } = req.params;
    if (id && page) {
        pageslogic.SetActive(id, page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetActiveList = (req, res) => {
    const { Data, Page } = req.body;
    if (Page && Data) {
        pageslogic.SetActiveList(Data, Page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.DeletePage = (req, res) => {
    const { Id, Page } = req.body;
    if (Page && Id) {
        pageslogic.DeletePage(Id, Page)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(501)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.PreviewPage = (req, res) => {
    const { page, bucket, id } = req.params;
    if (page && bucket && id) {
        pageslogic.PreviewPage(bucket, id)
            .then(previewPage => {
                let pageview = `${page}page/${page}`;
                if (page.includes("blogs")) {
                    pageview = 'blogslistpage/blogslist'
                }
                res.render(pageview, {
                    Desktop: (req.device.type == 'desktop' ? true : false),
                    moment, Url: "admin",
                    Navigation: previewPage.Navigation,
                    Footer: previewPage.Footer,
                    Branches: previewPage.Branches,
                    Installers: previewPage.Installers,
                    Comments: previewPage.Comments,
                    Blogs: previewPage.Blogs,
                    Page: previewPage.Page.Data,
                    PixelsAndNav: []
                });
            })
    } else {
        res.sendStatus(403)
    }
}

exports.GetArchitectsList = (req, res) => {
    pageslogic.GetAllArchitects()
        .then(result => {
            res.send(result[0])
        })
}

exports.GetArchitectById = (req, res) => {
    const { id } = req.params;
    if (id) {
        pageslogic.GetPageById(id, "architectslist-tmp")
            .then(result => {
                res.send(result)
                return
            })
            .catch(err => {
                res.sendStatus(404)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.UpdateArchitectById = (req, res) => {
    const { id } = req.params;
    let { Data } = req.body;
    if (id && Data) {
        pageslogic.UpdateArchitectById(id, Data)
            .then(() => {
                res.sendStatus(200)
                return
            })
            .catch(err => {
                res.sendStatus(404)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.PreviewStartPage = (req, res) => {
    const { bucket, id } = req.params;
    pageslogic.PreviewStartPage(bucket, id)
        .then(generals => {
            res.render('startpage/startpage', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                moment, Url: "admin",
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Sales: generals.Sales,
                News: generals.News,
                Blogs: generals.Blogs,
                Branches: generals.Branches,
                Comments: generals.Comments,
                RecommendedList: generals.RecommendedList,
                Carousel: generals.Carousel.Data,
                PixelsAndNav: [],
                Page: []
            });
        })
}

exports.GetPageByBucketAndId = (req, res) => {
    const { bucket, id } = req.params;
    if (bucket && id) {
        pageslogic.GetPageById(id, bucket)
            .then(page => {
                if (page) {
                    res.send(page.Data)
                } else {
                    res.sendStatus(404)
                }
                return;
            })
            .catch(err => {
                res.sendStatus(404)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.GetProjectsByArchitectId = (req, res) => {
    const { id } = req.params;
    if (id) {
        pageslogic.GetProjectsByArchitectId(id)
            .then(results => {
                res.send(results[0])
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetRedirects = (req, res) => {
    const { Redirects } = req.body;
    if (Redirects && Redirects.Links.length) {
        pageslogic.SetRedirects(Redirects)
            .then(results => {
                if (results) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.DeactivateBlock = (req, res) => {
    const { block } = req.params;
    if (block) {
        pageslogic.DeactivateBlock(block)
            .then(results => {
                if (results) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.IncomingRequests = (req, res) => {
    pageslogic.GetIncomingRequests()
        .then(incomingRequests => {
            res.render("adminpanel/incomingrequests", { IncomingRequests: incomingRequests, moment, controller: "incomingrequests", UserType: req.user.UserType })
        })
}

exports.SetNotActiveIncomingRequestById = (req, res) => {
    let { id, bucket } = req.params;
    if (id && bucket) {
        pageslogic.SetNotActiveIncomingRequestById(id, bucket)
            .then(() => {
                res.sendStatus(200)
            })
            .catch(err => {
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.GetNotifications = (req, res) => {
    pageslogic.GetNotifications()
        .then(notifications => {
            res.send(notifications)
        })
        .catch(err => {
            res.sendStatus(500)
        })
}

exports.GetCollectionById = (req, res) => {
    const { id, bucket} = req.params;
    if (id && bucket) {
        pageslogic.GetPageById(id, bucket + "-tmp")
            .then(result => {
                res.send(result)
                return
            })
            .catch(err => {
                res.sendStatus(404)
            })
    } else {
        res.sendStatus(403)
    }
}

exports.UpdateCollectionById = (req, res) => {
    const { id, bucket } = req.params;
    let { Data } = req.body;
    if (id && Data && bucket) {
        pageslogic.UpdateCollectionById(id, Data, bucket)
            .then(() => {
                res.sendStatus(200)
                return
            })
            .catch(err => {
                res.sendStatus(404)
            })
    } else {
        res.sendStatus(403)
    }
}


exports.GetCollectionsList = (req, res) => {
    pageslogic.GetCollectionsList()
        .then(result => {
            res.send(result)
        })
}

exports.GetDoorsPagesList = (req, res) => {
    pageslogic.GetDoorsPagesList()
        .then(result => {
            res.send(result)
        })
}

exports.SetNewCatalogPage = (req, res) => {
    const { DataPage, Page } = req.body;
    const { lang } = req.params;
    if (Page && DataPage) {
        pageslogic.SetNewCatalogPage(DataPage, Page, lang)
            .then(result => {
                if (result) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}

exports.SetVersionsByLanguage = (req, res) => {
    const { bucket, type } = req.params;
    if (bucket) {
        pageslogic.GetPageForAdmin(bucket)
            .then(([prod, tmp]) => {
                let partialPage = "adminpanel/parialvertionswithoneprod"
                if(Number(type)){
                    partialPage = "adminpanel/parialvertionswithmultiprod"
                }
                res.render(partialPage, { Prod: prod[0], Prods: prod, Versions: tmp, moment, Bucket: bucket })
            })
    } else {
        res.sendStatus(403)
    }
}


exports.SetCommonWords = (req, res) => {
    const { CommonWords } = req.body;
    if (CommonWords) {
        pageslogic.SetCommonWords(CommonWords)
            .then(results => {
                if (results) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
            })
    } else {
        res.sendStatus(403)
    }
}