const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");

// REGISTER
router.post('/api/auth/register', authController.register);

// LOGIN
router.post('/api/auth/login', authController.login);

router.get('/api/auth/me', authController.me);

module.exports = router;