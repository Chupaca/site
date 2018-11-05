'use strict'

const promise = require("bluebird");
const navigation = require("../data/navigation");
const footer = require("../data/footer");
const pages = require("../data/pages");

const GetNavigationItemsForAdmin = () => promise.all([navigation.GetNavigationItems("Navigation"), navigation.GetNavigationItems("Navigation-tmp")]);

const GetNavigationItemsById = (id, bucket) => navigation.GetNavigationItemsById(id, bucket);

const SetNewNavigation = data => navigation.SetNewNavigation(data);

const SetActive = id => navigation.SetActive(id);

const PreviewNavigation = (bucket, id) => {
    return promise.all([
        navigation.GetNavigationItemsById(id, bucket),
        footer.GetNavigationItemsForProd(),
        pages.GetPageProd('aboutus')
    ])
    .then(([navigation, footer, page]) => {
        return { Navigation: navigation, Footer: footer, Page:page}
    })
}

//================== footer ========================

const GetFooterItemsForAdmin = () => promise.all([footer.GetFooterItems("FooterNavigation"), footer.GetFooterItems("FooterNavigation-tmp")]);

const GetFooterItemsById = (id, bucket) => footer.GetFooterItemsById(id, bucket);

const SetNewFooter = data => footer.SetNewFooter(data);

const SetActiveFooter = id => footer.SetActive(id);

const PreviewFooter = (bucket, id) => {
    return promise.all([
        navigation.GetNavigationItemsForProd(),
        footer.GetFooterItemsById(id, bucket),
        pages.GetPageProd('aboutus')
    ])
    .then(([navigation, footer, page]) => {
        return { Navigation: navigation, Footer: footer, Page:page}
    })
}

module.exports = {
    GetNavigationItemsForAdmin,
    GetNavigationItemsById,
    SetNewNavigation,
    SetActive,
    PreviewNavigation,
    GetFooterItemsForAdmin,
    GetFooterItemsById,
    SetNewFooter,
    SetActiveFooter,
    PreviewFooter
}