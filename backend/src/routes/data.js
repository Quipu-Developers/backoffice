const express = require('express');
const { General_member, Dev_member} = require('../models');
//const General_member = require('../models/joinquipuModels/general_member');
const {isLoggedIn} = require('../middlewares');
const getData = require('../controllers/getdata');
const getFile = require('../controllers/getfile');

const router = express.Router();

// GET /data/joinquipu 테이블
router.get('/joinquipu_general', isLoggedIn, getData(General_member));
router.get('/joinquipu_dev', isLoggedIn, getData(Dev_member));

// GET /data/joinqupiu_dev_file
router.get('/joinquipu_dev_file/:filename', isLoggedIn, getFile);


module.exports = router;
