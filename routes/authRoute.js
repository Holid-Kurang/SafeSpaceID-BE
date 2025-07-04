const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// REGISTER
router.post('/api/auth/register', authController.register);

// LOGIN
router.post('/api/auth/login', authController.login);

module.exports = router;