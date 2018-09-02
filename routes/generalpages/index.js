'use strict'

const express = require('express');
const generalpages = require("./generalpages")
const router = express.Router();

router.get('/', generalpages.GetStartPage);

module.exports = router;