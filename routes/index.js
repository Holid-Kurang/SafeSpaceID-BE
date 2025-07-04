const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoute");

router.use("/", authRoutes);

module.exports = router;