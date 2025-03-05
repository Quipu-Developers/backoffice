const express = require("express");
const { Member } = require("../models");
const { isLoggedIn } = require("../middlewares");
const getData = require("../controllers/getdata");
const getPDF = require("../controllers/getpdf");

const router = express.Router();

// GET /bo/member
router.get(
  "/",
  (req, res, next) => {
    console.log(`[LOG] GET /bo/member 요청`);
    next(); // 다음 미들웨어 또는 컨트롤러로 이동
  },
  isLoggedIn,
  getData(Member)
);

// GET /bo/member/pdf/{filename}
router.get(
  "/pdf/:filename",
  (req, res, next) => {
    console.log(`[LOG] GET /bo/member/pdf/${req.params.filename} 요청`);
    next();
  },
  isLoggedIn,
  getPDF
);

module.exports = router;
