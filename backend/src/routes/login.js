const express = require('express');
const passport = require('passport');
const { isLoggedIn, isNotLoggedin } = require('../middlewares');
const { login, logout } = require('../controllers/auth');
const router = express.Router();

// POST /login
router.post('/login', isNotLoggedin, login);
// GET /logout
router.get('/logout', isLoggedIn, logout);
module.exports = router;