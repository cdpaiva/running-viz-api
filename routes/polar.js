const express = require("express");
const {
  getAuthCode,
  getProfile,
  createProfile,
} = require("../controllers/polar");

const router = express.Router();

router.get("/authCode", getAuthCode);
router.get("/profile", getProfile);
router.post("/profile", createProfile);

module.exports = router;
