'use strict'

const express = require('express');
const adminPanel = require("./admin")
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

router.get("/navigationeditor", adminPanel.GetNavigationEditor)
router.post("/setnewnavigation", adminPanel.SetNewNavigation)

router.get("/allimages", adminPanel.GetAllImages);




router.post('/uploadfiles', upload.any(), adminPanel.UploadNewImage);
router.post('/uploadfiles/delete', adminPanel.DeleteFile)






module.exports = router;