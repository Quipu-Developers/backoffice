const express = require('express');
const {isLoggedIn} = require('../middlewares');
const { upload, uploadHandler } = require('../controllers/uploadtoR2');

const router = express.Router();

// GET /bo/semina₩
router.post('/', (req, res, next) => {
  console.log(`[LOG] POST /bo/semina 요청`);
  next(); // 다음 미들웨어 또는 컨트롤러로 이동
}, isLoggedIn, upload, uploadHandler);

module.exports = router;
