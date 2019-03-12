'use strict'

const express = require('express');
const generalpages = require("./generalpageslang");
const sitemap = require("../sitemap");
const router = express.Router();


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
router.get('/sitemap', sitemap.GetSiteMapHTML);
router.get('/designersblogs', generalpages.GetDesignersBlogsListPage);
router.get('/designersblog/:index', generalpages.GetDesignersBlogPage);

module.exports = router;