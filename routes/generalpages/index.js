'use strict'

const express = require('express');
const generalpages = require("./generalpages");
const postFromClient = require("./postfromclient");
const landingPages = require("./landingpages");
const sitemap = require("../sitemap");
const router = express.Router();

const multer = require('multer');
const Storage = require('@google-cloud/storage');
const storage = Storage();

const storageMulter = multer.memoryStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"))
    }
})

var upload = multer(
    {
        storage: storageMulter,
        limits: {
            fileSize: 1 * 1024 * 1024
        }
    },
    {
        fileFilter: function (req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'));
            } else if (file.size > (1 * 1024 * 1024)) {
                return callback(new Error('File too large!'));
            }
            callback(null, true);
        }
    }
);

router.get('/', generalpages.GetStartPage);
router.get('/contact', generalpages.GetContactPage);
router.get('/branches', generalpages.GetBranchesPage);
router.get('/branches/:index', generalpages.GetBranchesPage);
router.get('/catalog', generalpages.GetCatalogPage);
router.get('/aboutus', generalpages.GetAboutUsPage);
router.get('/gallery', generalpages.GetGalleryPage);
router.get('/architectscontact', generalpages.GetArchitectsContactPage);
router.get('/project/:index', generalpages.GetProjectPage);
router.get('/comments', generalpages.GetCommentsPage);
router.get('/architectslist', generalpages.GetArchitectsListPage);
router.get('/architect/:id', generalpages.GetArchitectPage);
router.get('/door/:index', generalpages.GetDoorPage);
router.get('/sales/:index', generalpages.GetSalesPage);
router.get('/blog/:index', generalpages.GetBlogPage);
router.get('/video', generalpages.GetVideoPage);
router.get('/privacy', generalpages.GetPrivacyPage);
router.get('/blogs', generalpages.GetBlogsListPage);
router.get('/projectcontact', generalpages.GetProjectContactPage);
router.get('/accessibilitystatement', generalpages.GetAccessibilityStatementPage);
router.get('/pirzul', generalpages.GetPirzulPage);
router.get('/designersblogs', generalpages.GetDesignersBlogsListPage);
router.get('/designersblog/:index', generalpages.GetDesignersBlogPage);
//============= landing pages ======================================================
router.get('/pandoorwebmedia/:type/:frompage', landingPages.GetPage);
router.get('/catalogpandoor.pdf', landingPages.GetCatalogPandoorPDF)
//============= analytics gets =====================================================
router.get('/sitemap', sitemap.GetSiteMapHTML)
router.get('/sitemap.xml', sitemap.GetSiteMapXML);


//=============== posts ============================================================
router.post('/clientcomment', postFromClient.PostNewClientComment);
router.post('/priceoffer', postFromClient.PostNewClientPriceOffer);
router.post('/service', postFromClient.PostNewClientService);
router.post('/project', postFromClient.PostNewProject);
router.post('/architect', postFromClient.PostNewArchitect);

router.get('/thankyou', postFromClient.FinalSubmit)
router.get('/architectblank', postFromClient.GetPageForArchitectsBlank);
router.post('/architectblank', function (req, res, next) {
    let uploadFunc = upload.any()
    uploadFunc(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            res.render("architectsblank/architectsblank.ejs", {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Token: process.env.TOKEN,
                Success: false,
                MulterError: true,
                ...req.body
            })
        } else if (err) {
            res.render("architectsblank/architectsblank.ejs", {
                Desktop: (req.device.type == 'desktop' ? true : false),
                Token: process.env.TOKEN,
                Success: false,
                MulterError: true,
                ...req.body
            })
        } else {
            next();
        }
    })
}, postFromClient.PostNewArchitectBlank);

router.get('/robots.txt', sitemap.GetRobotTXT)

module.exports = router;