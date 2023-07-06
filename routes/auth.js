const { login, register, setNewPassword } = require("../controllers/auth.js");

const express = require("express");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", setNewPassword);

module.exports = router;
