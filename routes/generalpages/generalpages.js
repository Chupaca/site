'use strict'

const promise = require("bluebird")
const moment = require('moment');
const globalSettingsLogic = require("../../logic/globalsettings")

exports.GetStartPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('startpage/startpage', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
};

exports.GetContactPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('contactpage/contact', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetBranchesPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('branchespage/branches', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetCatalogPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('catalogpage/catalog', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetAboutUsPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('aboutuspage/aboutus', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}
exports.GetGalleryPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('gallerypage/gallery', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetArchitectsContactPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('architectscontactpage/architectscontact', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetProjectPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('projectpage/project', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}
exports.GetCommentsPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('commentspage/comments', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetArchitectsListPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('architectslistpage/architectslist', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetArchitectPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('architectpage/architect', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetDoorPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('doorpage/door', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetSalesPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('salespage/sales', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetBlogPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('blogpage/blog', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetVideoPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('videopage/video', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetPrivacyPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('privacypage/privacy', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetBlogsListPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('blogslistpage/blogslist', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}

exports.GetProjectContactPage = (req, res) => {
    globalSettingsLogic.GetGlobalSettings()
        .then(result => {
            res.render('projectcontactpage/projectcontact', { Desktop: (req.device.type == 'desktop' ? true : false), Navigation: result.Navigation , Footer: result.Footer });
        })
}
