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
router.get('/architectscontact', generalpages.GetArchitectsContactPage);
router.get('/project', generalpages.GetProjectPage);
router.get('/comments', generalpages.GetCommentsPage);
router.get('/architectslist', generalpages.GetArchitectsListPage);
router.get('/architect', generalpages.GetArchitectPage);
router.get('/door', generalpages.GetDoorPage);
router.get('/sales', generalpages.GetSalesPage);
router.get('/blog', generalpages.GetBlogPage);
router.get('/video', generalpages.GetVideoPage);
router.get('/privacy', generalpages.GetPrivacyPage);
router.get('/blogs', generalpages.GetBlogsListPage);
router.get('/projectcontact', generalpages.GetProjectContactPage);


module.exports = router;