'use strict'

const express = require('express');
const generalpages = require("./generalpages")
const router = express.Router();

router.get('/', generalpages.GetStartPage);
router.get('/contact', generalpages.GetContactPage);
router.get('/branches', generalpages.GetBranchesPage);
router.get('/catalog', generalpages.GetCatalogPage);

module.exports = router;