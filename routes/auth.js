const { login, register } = require("../controllers/auth.js");

const express = require("express");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/cookie", (req, res) => console.log(req.cookies));

module.exports = router;
