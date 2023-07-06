const express = require("express");
const {
  getAuthCode,
  getProfile,
  createProfile,
  syncAccount,
} = require("../controllers/polar");

const router = express.Router();

router.get("/authCode", getAuthCode);
router.get("/profile", getProfile);
router.post("/profile", createProfile);
router.post("/sync", syncAccount);

module.exports = router;
