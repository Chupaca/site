'use strict'

const promise = require("bluebird");
const pages = require("../data/pages");


const GetGlobalSettings = page => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetPageProd(page)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Page: page }
        })
}

const GetGlobalSettingsForStartPage = () => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetSales('sales'),
        pages.GetNews(),
        pages.GetBlogs(),
        pages.GetComments(),
        pages.RecommendedList(),
        pages.GetPageProd("carousel"),
        pages.GetPageProd("startpage")

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

const GetGlobalSettingsAndPageByIndex = (page, index) => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetPageByKindAndIndex(page, index),

    ])
        .then(([navigation, footer, branches, pixelsAndNav, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Page: page }
        })
}

const GetGlobalSettingsList = (pageList, page, limit) => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetPageListProd(pageList, limit),
        pages.GetPageProd(page)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, pageList, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, PageList: pageList, Page: page }
        })
}

const GetGlobalSettingsContacts = () => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetPageListProd("installers", 20),
        pages.GetPageProd("contact")
    ])
        .then(([navigation, footer, branches, pixelsAndNav, installers, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Installers: installers, Page: page }
        })
}

const GetGlobalSettingsArchitectPage = id => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetPageById(id, "architectslist"),
        pages.GetAllArchitectProjects(id)
    ])
        .then(([navigation, footer, branches, pixelsAndNav, architect, projects]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Architect: architect, Projects: projects[0] }
        })
}

const GetGlobalSettingsAndPageById = (id, page) => {
    return promise.all([
        pages.GetNavigationItemsForProd(),
        pages.GetFooterItemsForProd(),
        pages.GetBranchesItemsForProd(),
        pages.GetPageProd("pixelsandheadnav"),
        pages.GetPageById(id, page),

    ])
        .then(([navigation, footer, branches, pixelsAndNav, page]) => {
            return { Navigation: navigation[0], Footer: footer[0], Branches: branches[0], PixelsAndNav: pixelsAndNav, Page: page }
        })
}

const GetPageById = (id, bucket) => pages.GetPageById(id, bucket);
const GetPageProd = bucket => pages.GetPageProd(bucket);


module.exports = {
    GetGlobalSettings,
    GetGlobalSettingsForStartPage,
    GetGlobalSettingsAndPageByIndex,
    GetGlobalSettingsList,
    GetGlobalSettingsContacts,
    GetGlobalSettingsArchitectPage,
    GetGlobalSettingsAndPageById,
    GetPageById,
    GetPageProd
}