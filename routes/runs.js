const express = require("express");
const {
  createRun,
  getAllRuns,
  getRun,
  deleteRun,
  updateRun,
} = require("../controllers/runs");

const router = express.Router();

router.route("/").post(createRun).get(getAllRuns);
router.route("/:id").get(getRun).delete(deleteRun).patch(updateRun);

module.exports = router;
