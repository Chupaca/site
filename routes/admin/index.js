'use strict'

const express = require('express');
const adminPanel = require("./admin");
const navfooter = require("./navfooter");
const uploadfiles = require("./uploadfiles");
const pageeditor = require("./pageeditor");

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
router.post("/setnewnavigation", navfooter.SetNewNavigation);

router.get("/footereditor", navfooter.GetFooterEditor);
router.post("/setnewfooter", navfooter.SetNewFooter);

//============== upload files ======================
router.get("/galleryeditor", uploadfiles.GetGalleryEditor);
router.get("/allimages", uploadfiles.GetAllImages);
router.post('/uploadfiles', upload.any(), uploadfiles.UploadNewImage);
router.post('/uploadfiles/delete', uploadfiles.DeleteFile)

//============== page edit ===========================
router.get("/pagetoedit", pageeditor.GetPageForEdit);
router.post("/setpage", pageeditor.SetPage);







module.exports = router;