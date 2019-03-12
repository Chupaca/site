'use strict'

const promise = require("bluebird");
const pages = require("../data/pages");


const GetGlobalSettings = (page, lang="")  => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPageProd(page)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Page: page }
        })
}

const GetGlobalSettingsForStartPage = (lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetSales(lang),
        pages.GetNews(lang),
        pages.GetBlogs(lang),
        pages.GetComments(lang),
        pages.RecommendedList(lang),
        pages.GetPageProd(lang + "carousel"),
        pages.GetPageProd( lang + "startpage")

    ])
        .then(([navigation, footer, branches, pixelsAndNav, sales, news, blogs, comments, recommendedlist, carousel, startPage]) => {
            return {
                Navigation: navigation[0],
                Footer: footer[0],
                Branches: branches[0],
                PixelsAndNav: pixelsAndNav,
                Sales: sales[0],
                News: news[0],
                Blogs: blogs[0],
                Comments: comments[0],
                RecommendedList: recommendedlist[0],
                Carousel: carousel,
                StartPage: startPage
            }
        })
}

const GetGlobalSettingsAndPageByIndex = (page, index, lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPageByKindAndIndex(page, index),

    ])
        .then(([navigation, footer, branches, pixelsAndNav, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Page: page }
        })
}

const GetGlobalSettingsList = (pageList, page, limit, lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPageListProd(pageList, limit),
        pages.GetPageProd(page)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, pageList, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, PageList: pageList, Page: page }
        })
}

const GetGlobalSettingsContacts = (lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPageListProd(lang + "installers", 20),
        pages.GetPageProd(lang + "contact")
    ])
        .then(([navigation, footer, branches, pixelsAndNav, installers, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Installers: installers, Page: page }
        })
}

const GetGlobalSettingsArchitectPage = (id, lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPageById(id, lang + "architectslist"),
        pages.GetAllArchitectProjects(id)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, architect, projects]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Architect: architect, Projects: projects[0] }
        })
}

const GetGlobalSettingsAndPageById = (id, page, lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPageById(id, page),

    ])
        .then(([navigation, footer, branches, pixelsAndNav, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Page: page }
        })
}

const GetPageById = (id, bucket) => pages.GetPageById(id, bucket);
const GetPageProd = bucket => pages.GetPageProd(bucket);
const GetCountOfBucket = bucket => pages.GetCountOfBucket(bucket);

const GetPartialByPageAndLimit = (bucket, fromPosition, limit) => pages.GetPartialByPageAndLimit(bucket, fromPosition, limit)


const GetGlobalSettingsListByPage = (pageList, page, fromPosition, limit, lang="") => {
    return promise.all([
        pages.GetNavigationItemsForProd(lang),
        pages.GetFooterItemsForProd(lang),
        pages.GetBranchesItemsForProd(lang),
        pages.GetPageProd(lang + "pixelsandheadnav"),
        pages.GetPartialByPageAndLimit(pageList, fromPosition, limit),
        pages.GetPageProd(page)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, pageList, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, PageList: pageList, Page: page }
        })
}

module.exports = {
    GetGlobalSettings,
    GetGlobalSettingsForStartPage,
    GetGlobalSettingsAndPageByIndex,
    GetGlobalSettingsList,
    GetGlobalSettingsContacts,
    GetGlobalSettingsArchitectPage,
    GetGlobalSettingsAndPageById,
    GetPageById,
    GetPageProd,
    GetCountOfBucket,
    GetPartialByPageAndLimit,
    GetGlobalSettingsListByPage
}