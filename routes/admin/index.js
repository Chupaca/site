'use strict'

const express = require('express');
const adminPanel = require("./admin")
const router = express.Router();



router.get("/", adminPanel.GetAdminPanel);
router.get("/login", adminPanel.Login);
router.get("/allimages", adminPanel.GetAllImages);






module.exports = router;