'use strict'

const promise = require("bluebird");
const navigation = require("../data/navigation");
const footer = require("../data/footer");

const GetNavigationItemsForAdmin = () => promise.all([navigation.GetNavigationItems("Navigation"), navigation.GetNavigationItems("Navigation-tmp")]);

const GetNavigationItemsById = id => navigation.GetNavigationItemsById(id);

const SetNewNavigation = data => navigation.SetNewNavigation(data);

const SetActive = id => navigation.SetActive(id);


//================== footer ========================

const GetFooterItemsForAdmin = () => promise.all([footer.GetFooterItems("FooterNavigation"), footer.GetFooterItems("FooterNavigation-tmp")]);

const GetFooterItemsById = id => footer.GetFooterItemsById(id);

const SetNewFooter = data => footer.SetNewFooter(data);

const SetActiveFooter = id => footer.SetActive(id);



module.exports = {
    GetNavigationItemsForAdmin,
    GetNavigationItemsById,
    SetNewNavigation,
    SetActive,
    GetFooterItemsForAdmin,
    GetFooterItemsById,
    SetNewFooter,
    SetActiveFooter
}