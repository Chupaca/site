'use strict'

const express = require('express');
const adminPanel = require("./admin");
const navfooter = require("./navfooter");
const uploadfiles = require("./uploadfiles");

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
router.get("/allimages", uploadfiles.GetAllImages);
router.post('/uploadfiles', upload.any(), uploadfiles.UploadNewImage);
router.post('/uploadfiles/delete', uploadfiles.DeleteFile)






module.exports = router;