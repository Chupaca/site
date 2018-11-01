'use strict'

const express = require('express');
const adminPanel = require("./admin");
const navfooter = require("./navfooter");
const uploadFiles = require("./uploadfiles");
const pageEdit = require("./pageeditor");
const listsEditor = require("./listseditor");

var multer = require('multer');
const router = express.Router();

const storageMulter = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

var upload = multer(
    { storage: storageMulter },
    {
        fileFilter: function (req, file, callback) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'));
            }
            callback(null, true);
        }
    }
);


router.get("/", adminPanel.GetAdminPanel);
router.get("/login", adminPanel.Login);


//========= navigation + footer ==================================
router.get("/navigationeditor", navfooter.GetNavigationEditor);
router.get("/navigationeditor/:id", navfooter.GetNavigationById);
router.post("/setnewnavigation", navfooter.SetNewNavigation);
router.post("/navigationeditor/setactive/:id", navfooter.SetActive);


router.get("/footereditor", navfooter.GetFooterEditor);
router.get("/footereditor/id", navfooter.GetFooterItemsById);
router.post("/setnewfooter", navfooter.SetNewFooter);
router.post("/footereditor/setactive/:id", navfooter.SetActiveFooter);

//============== upload files ======================
router.get("/galleryeditor", uploadFiles.GetGalleryEditor);
router.get("/allimages", uploadFiles.GetAllImages);
router.post('/uploadfiles', upload.any(), uploadFiles.UploadNewImage);
router.post('/uploadfiles/delete', uploadFiles.DeleteFile)

//============== page edit ===========================
router.get("/pagetoedit", pageEdit.GetPageForEdit);
router.post("/setpage", pageEdit.SetPage);
router.post("/setpagetolist", pageEdit.SetPageToList);


//=========== list edit ==================================
router.get("/listeditor/:list", listsEditor.GetListEditor)







module.exports = router;