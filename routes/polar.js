const express = require("express");
const {
  getAuthCode,
  getProfile,
  createProfile,
  syncAccount,
} = require("../controllers/polar");

const router = express.Router();

const authMiddleware = require("../middleware/authentication");

router.get("/authCode", getAuthCode);
router.get("/profile", getProfile);
router.post("/profile", createProfile);
router.post("/sync", authMiddleware, syncAccount);

module.exports = router;
