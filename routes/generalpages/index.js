'use strict'

const express = require('express');
const generalpages = require("./generalpages")
const router = express.Router();

router.get('/', generalpages.GetStartPage);
router.get('/contact', generalpages.GetContactPage);
router.get('/branches', generalpages.GetBranchesPage);
router.get('/catalog', generalpages.GetCatalogPage);
router.get('/aboutus', generalpages.GetAboutUsPage);
router.get('/gallery', generalpages.GetGalleryPage);
router.get('/architects', generalpages.GetArchitectsPage);

module.exports = router;