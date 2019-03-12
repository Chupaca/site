'use strict'

const express = require('express');
const uploadFiles = require("./uploadfiles");
const pageEdit = require("./pageeditor");
const multer = require('multer');
const router = express.Router();
const oauth2 = require('./authenticate');
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
            fileSize: 150 * 1024
        }
    },
    {
        fileFilter: function (req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'));
            }
            callback(null, true);
        }
    }
);

router.use(oauth2.AddTemplateVariables);

router.get("/", (req, res) => { res.redirect("/admin/incomingrequests") });

router.get("/logout", oauth2.Logout)

//============== upload files ======================
router.get("/galleryeditor", uploadFiles.GetGalleryEditor);
router.get("/allimages", uploadFiles.GetAllImages);
router.post('/uploadfiles', upload.any(), uploadFiles.UploadNewImage);
router.post('/uploadfiles/delete', uploadFiles.DeleteFile)



router.get('/incomingrequests', pageEdit.IncomingRequests);
router.post('/incomingrequest/notactive/:id/:bucket', pageEdit.SetNotActiveIncomingRequestById);


router.get("/notifications", pageEdit.GetNotifications)
//============== page edit ===========================
router.get("/pagetoedit", pageEdit.GetPageForEdit);

router.post("/setnewpage", pageEdit.SetNewPage);
router.post("/pagetoedit/setactive/list", pageEdit.SetActiveList);
router.post("/pagetoedit/setactive/:id/:page", pageEdit.SetActive);
router.post("/deletepage", pageEdit.DeletePage)
router.get("/previewpage/:page/:bucket/:id", pageEdit.PreviewPage)
router.get("/previewstartpage/:bucket/:id", pageEdit.PreviewStartPage);
router.post("/pagetoedit/setdeactivate/block/:block", pageEdit.DeactivateBlock)

router.get("/pagetemplate/:bucket/:id", pageEdit.GetPageByBucketAndId);
router.get("/pagetoedit/:id", pageEdit.GetPageById);

router.get("/architectslist", pageEdit.GetArchitectsList);
router.get("/architect/:id", pageEdit.GetArchitectById);
router.post("/architect/:id", pageEdit.UpdateArchitectById);
router.get("/architect/:id/projects", pageEdit.GetProjectsByArchitectId);

router.get("/collectionslist", pageEdit.GetCollectionsList);
router.get("/collection/:id/:bucket", pageEdit.GetCollectionById)
router.post("/collection/:id/:bucket", pageEdit.UpdateCollectionById);

router.get("/doorspageslist", pageEdit.GetDoorsPagesList)

router.post("/saveredirects", pageEdit.SetRedirects)

router.post("/setnewcatalogpage/:lang", pageEdit.SetNewCatalogPage);

router.get("/versionsbylanguage/:bucket/:type", pageEdit.SetVersionsByLanguage)
router.post("/commonwords", pageEdit.SetCommonWords)

module.exports = router;