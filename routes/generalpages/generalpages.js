'use strict'

const promise = require("bluebird");
const moment = require('moment');
const globalSettingsLogic = require("../../logic/globalsettings");

exports.GetStartPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettingsForStartPage()
        .then(generals => {
            res.render('startpage/startpage', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Sales:generals.Sales,
                Page: []
            });
        })
};

exports.GetAboutUsPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings("aboutus")
        .then(generals => {
            res.render('aboutuspage/aboutus', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Page: generals.Page.Data
            });
        })
};

exports.GetProjectContactPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings("projectcontact")
        .then(generals => {
            res.render('projectcontactpage/projectcontact', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Page: generals.Page.Data
            });
        })
};

exports.GetArchitectsContactPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings("architectscontact")
        .then(generals => {
            res.render('architectscontactpage/architectscontact', {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Page: generals.Page.Data
            });
        })
};

exports.GetSalesPage = (req, res) => {
    const { index } = req.params;
    globalSettingsLogic.GetGlobalSettingsAndPageByIndex("sales", Number(index))
        .then(generals => {
            res.render('salespage/sales', { 
                Desktop: (req.device.type == 'desktop' ? true : false),
                Navigation: generals.Navigation,
                Footer: generals.Footer,
                Page: generals.Page.Data
            });
        })
}


exports.GetContactPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('contactpage/contact', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetBranchesPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('branchespage/branches', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetCatalogPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('catalogpage/catalog', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetGalleryPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('gallerypage/gallery', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetProjectPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('projectpage/project', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}
exports.GetCommentsPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('commentspage/comments', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetArchitectsListPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('architectslistpage/architectslist', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetArchitectPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('architectpage/architect', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetDoorPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('doorpage/door', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}


exports.GetBlogPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('blogpage/blog', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetVideoPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('videopage/video', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetPrivacyPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('privacypage/privacy', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}

exports.GetBlogsListPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('blogslistpage/blogslist', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation, Footer: result.Footer, Page: [] });
        })
}