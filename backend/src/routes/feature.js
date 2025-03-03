const express = require("express");
const { isLoggedIn } = require("../middlewares");
const { checkRecruit, changeRecruit } = require("../controllers/recruit");
const router = express.Router();

// GET /recruit
router.get("/recruit", isLoggedIn, checkRecruit);
// PATCH /recruit
router.patch("/recruit", isLoggedIn, changeRecruit);

module.exports = router;
